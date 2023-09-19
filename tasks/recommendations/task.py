import os
import sys

sys.path.append('../../lib')

from datetime import datetime

from candidate import new_candidate
from company import get_company, new_company
from dydb import bolsters_db
from engagement import new_engagement
from logger import log
from opportunist import new_opportunist
from query import QUERY_MAP
from s3 import write_to_s3
from seq import seq_cache
from weight import new_influence_weight


def run_task(dry_run: str = "true"):

    context_files_created = []
    errors = []

    for engagement in bolsters_db.query(**QUERY_MAP.get("ENGAGEMENTS")):

        context_start = datetime.now()

        context = get_context(engagement=engagement)

        engagement_pk = engagement.get('PK', '')

        err = ""

        if dry_run == "false":

            ####################
            # WRITE OUTPUT TO S3
            ####################
            s3_path, err = write_to_s3(
                s3_filename=f"{engagement_pk.replace('ENGAGEMENT#', '')}.json",
                content=context,
            )

            if err:
                errors.append(err)
            else:
                context_files_created.append(s3_path)

            log({"msg": f"[CONTEXT {'ERROR' if err else 'CREATED'}] - runtime={datetime.now() - context_start} engagement={engagement_pk}"})

        else:
            log({"msg": f"[DRY RUN] - runtime={datetime.now() - context_start}"})
            log({"msg": f"[CONTEXT] - {context}"})

    return context_files_created, errors


def get_context(engagement: dict) -> dict:

    context = {}

    engagement_pk = engagement.get("PK", "")

    ###################
    # COMPANY
    # - companyIndustries
    # - companyRegions
    # - companyRevenue
    ###################

    engagement_company = get_company(engagement=engagement)

    if engagement_company:

        company = next(bolsters_db.query(**QUERY_MAP["COMPANY"](company_pk=engagement_company)), {})

        company_context = new_company(company=company)

        context = {
            **context,
            **company_context
        }

    ##########################
    # ENGAGEMENT
    # - searchIndustries
    # - searchRole
    # - searchWorkType
    # - searchRoleType
    # - searchRegions
    # - searchSkills
    # - search (may not need?)
    ##########################

    engagement_context, err = new_engagement(engagement=engagement)

    if err:
        errors.append(err)

    context = {
        **context,
        **engagement_context
    }

    ####################
    # CANDIDATES
    # - candidates
    ####################
    context["candidates"] = {}

    for candidate in bolsters_db.query(**QUERY_MAP.get("CANDIDATES")(engagement=engagement_pk)):

        candidate_pk = candidate.get("PK", "")

        context["candidates"][candidate_pk] = new_candidate(candidate)

    #############
    # DWELL TIME
    # - dwellHist
    #############

    dwell_hist = list(bolsters_db.query(
        **QUERY_MAP.get("DWELL")(
            user_pk=f"USER#{engagement.get('D', {}).get('creatorBID', '')}",
            engagement=engagement_pk
        )))

    ################
    # OPPORTUNISTS
    # - opportunists
    ################

    context["opportunists"] = {}

    for opportunist in bolsters_db.query(**QUERY_MAP.get("OPPORTUNISTS")(engagement=engagement_pk)):

        context["opportunists"] = {
            **context["opportunists"],
            **new_opportunist(opportunist=opportunist),
        }

    ############
    # MESSAGES
    # - messages
    ############

    context["messages"] = {}

    for message in bolsters_db.query(**QUERY_MAP.get("MESSAGES")(engagement=engagement_pk)):

        recipient = message.get("G2", "")

        if recipient not in context["messages"]:
            context["messages"][recipient] = 1
        else:
            context["messages"][recipient] += 1

    #############################
    # CALCULATE INFLUENCE WEIGHTS
    #############################
    influence_weights = new_influence_weight(
        candidate_ctx=context.get("candidates"),
        dwell_ctx=dwell_hist,
        message_ctx=context.get("messages"),
    )

    context["candidateInfluenceWeights"] = influence_weights

    context["potentialCandidateInfluenceWeights"] = {
        PK: weight for PK, weight in influence_weights.items() if PK not in context["candidates"]}

    ###########
    # SEED SEQ
    # - seedSeq
    ###########

    context["seedSeq"] = {}

    for PK in influence_weights:

        # we don't care about Seq ID's if their weight is 0.
        if influence_weights[PK] == 0:
            log({"msg": f"[SKIP] 'Seq' fetch - { PK = } {influence_weights[PK] = }"})
            continue

        # if we haven't already cached Seq from a previous query, cache it.
        if PK not in seq_cache:

            member = next(bolsters_db.query(**QUERY_MAP.get("SEQ")(member_pk=PK)), {})

            seq = member.get("Seq")

            if seq:
                seq_cache[PK] = int(seq)  # cast to int since we can't write Decimal to S3
            else:
                log({"msg": f"[SKIP] Missing 'Seq' - { PK = } { seq = }"})
                continue

        context["seedSeq"] = {
            **context["seedSeq"],
            PK: seq_cache[PK]
        }

    return context


if __name__ == "__main__":

    if os.environ.get("SKIP_RUN", "false").lower() == "true":
        log({"msg": "[TASK START] SKIP_RUN=True - not configured to RUN in this environment"})
        exit()

    dry_run = os.environ.get("DRY_RUN", "true").lower()

    start = datetime.now()

    log({"msg": f"[TASK START] DRY_RUN={dry_run}"})

    success, errors = run_task(dry_run=dry_run)

    log({"msg": f"[TASK COMPLETE] - runtime={datetime.now() - start} success_total={len(success)} error_total={len(errors)}"})

    if errors:

        log({"msg": f"[TASK ERRORS] - total={len(errors)}"})

        for err in errors:
            log(err)
