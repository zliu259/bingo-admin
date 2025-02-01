from fastapi import APIRouter

from .management import router

management_router = APIRouter()
management_router.include_router(router, tags=["管理模块"])

__all__ = ["management_router"]