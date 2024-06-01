import { GithubIcon, YoutubeIcon, TwitterIcon } from "@/components/icons";
import { Link } from "@nextui-org/link";
import { siteConfig } from "@/config/site";

export default function Footer() {
    return (
        <footer className="border-t">
            <div className="py-2 flex justify-between max-w-7xl mx-auto">
                <aside className="items-center grid-flow-col">
                    <p>
                        <span className="font-semibold text-xl">ShpIT</span> <br />
                        Providing reliable tech since 1992
                    </p>
                </aside>
                <nav className="md:place-self-center md:justify-self-end">
                    <div className="grid grid-flow-col gap-4">
                        <Link isExternal aria-label="Twitter" href={siteConfig.links.twitter}>
                            <TwitterIcon className="text-default-500" size={34} />
                        </Link>

                        <Link isExternal aria-label="Twitter" href={siteConfig.links.github}>
                            <GithubIcon className="text-default-500" size={34} />
                        </Link>

                        <Link isExternal aria-label="Twitter" href={siteConfig.links.youtube}>
                            <YoutubeIcon className="text-default-500" size={34} />
                        </Link>
                    </div>
                </nav>
            </div>
        </footer>
    );
}
