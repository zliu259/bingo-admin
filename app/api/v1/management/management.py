import logging

from fastapi import APIRouter, Query

from app.controllers.menu import menu_controller
from app.schemas.base import Fail, Success, SuccessExtra
from app.schemas.menus import *

from app.controllers.cfdb import CfDatabase

logger = logging.getLogger(__name__)

router = APIRouter()

# Client
class Client(BaseModel):
    name: str
    abn: str
    contact: str
    method: str
    details: str
    note: str
    client_id: str
    created_by: str
    created_time: str

@router.get("/getClientList", summary="查看客户列表")
async def get_client_list():
    db = CfDatabase()
    clients = db.list_all_clients()
    return SuccessExtra(data=clients)

@router.post("/addClient", summary="添加客户")
async def add_client(data:Client):
    db = CfDatabase()
    db.insert_client([data.dict()])
    return Success(msg="Created Successfully")

@router.post("/updateClient", summary="更新客户")
async def update_client(data:Client):
    db = CfDatabase()
    db.update_client(data.client_id, data.dict())
    return Success(msg="Updated Successfully")

@router.delete("/deleteClient/{client_id}", summary="删除客户")
async def delete_client(client_id:str):
    db = CfDatabase()
    db.delete_client(client_id)
    return Success(msg="Deleted Successfully")

# Provider
class Provider(BaseModel):
    id: str
    name: str
    abn: str
    address: str
    contact: str
    bank: str
    bsb: str
    account: str

@router.get("/getProviderList", summary="查看供应商列表")
async def get_provider_list():
    db = CfDatabase()
    providers = db.list_all_providers()
    return SuccessExtra(data=providers)

@router.get("/getProviderById/{provider_id}", summary="查看供应商")
async def get_provider_by_id(provider_id:str):
    db = CfDatabase()
    provider = db.get_provider_by_id(provider_id)
    return Success(data=provider)

@router.post("/addProvider", summary="添加供应商")
async def add_provider(data:Provider):
    db = CfDatabase()
    db.insert_provider([data.dict()])
    return Success(msg="Created Successfully")

@router.post("/updateProvider", summary="更新供应商")
async def update_provider(data:Provider):
    db = CfDatabase()
    db.update_provider(data.id, data.dict())
    return Success(msg="Updated Successfully")

@router.delete("/deleteProvider/{id}", summary="删除供应商")
async def delete_provider(id:str):
    db = CfDatabase()
    db.delete_provider(id)
    return Success(msg="Deleted Successfully")

