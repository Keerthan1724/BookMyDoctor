import time
import logging
from django.utils.deprecation import MiddlewareMixin
from django.db import connection

logger = logging.getLogger(__name__)

class RequestTimingMiddleware(MiddlewareMixin):
    def process_request(self, request):
        request._start_time = time.perf_counter()
        try:
            request._start_queries = len(connection.queries)
        except Exception:
            request._start_queries = 0

    def process_response(self, request, response):
        start = getattr(request, "_start_time", None)
        if start is not None:
            elapsed_ms = int((time.perf_counter() - start) * 1000)
            response["X-Response-Time-ms"] = str(elapsed_ms)
            try:
                total_queries = len(connection.queries)
                new_queries = total_queries - getattr(request, "_start_queries", 0)
                logger.info("%s %s completed in %d ms (DB queries: %d)", request.method, request.path, elapsed_ms, new_queries)
            except Exception:
                logger.info("%s %s completed in %d ms", request.method, request.path, elapsed_ms)

        return response
