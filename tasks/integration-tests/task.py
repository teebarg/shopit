import click
import logging
import sys
import unittest
from datetime import datetime


@click.command()
@click.option('--package', default=None, help='Package to run test framework against.')
def test(package):
    """Run integration tests across our API and Search Service

       Example Usage:

       > make local-test (run all tests)
       > make p=search/admin local-test (run search service admin tests only)
    """

    """timestamp for this run"""
    logging.info(f"\n\nRunning Python Version {sys.version}\n\n")
    ts_start = datetime.now()

    test_suite = None

    """run a specific test module"""
    test_suite = unittest.TestLoader().discover(f'./test/{package}') if package else unittest.TestLoader().discover(".")

    unittest.TextTestRunner(verbosity=1, failfast=False).run(test_suite)

    logging.info('Completed Run Time: %s seconds', (datetime.now() - ts_start).total_seconds())

if __name__ == '__main__':
    test()
