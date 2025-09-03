from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from ...services.supernova_service import api_supernova_service

router = APIRouter()

class ChatRequest(BaseModel):
    instance_id: str
    message: str

class ChatResponse(BaseModel):
    response: str

@router.post("/chat", response_model=ChatResponse)
def chat_with_persona(request: ChatRequest):
    """
    Sends a message to an active persona instance and gets a response.
    """
    try:
        response_text = api_supernova_service.process_turn(
            instance_id=request.instance_id, 
            user_query=request.message
        )
        return ChatResponse(response=response_text)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal Error during chat: {str(e)}")