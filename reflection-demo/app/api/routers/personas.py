from fastapi import APIRouter, HTTPException
from ...schemas.persona_schemas import PersonaInstance
from ...services.ais_service import api_ais_service

router = APIRouter()

@router.post("/{persona_id}/rehydrate", response_model=PersonaInstance)
def rehydrate_persona_endpoint(persona_id: str):
    """
    This API endpoint triggers the rehydration (instantiation) of a persona
    [cite_start]from an existing blueprint. [cite: 630]
    """
    try:
        # We call our service 'adapter' to do the heavy lifting
        active_instance = api_ais_service.rehydrate(persona_id)
        return active_instance
    except ValueError as e:
        # Handle cases where the persona blueprint doesn't exist
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        # Handle any other errors during the complex instantiation process
        raise HTTPException(status_code=500, detail=f"Internal Error: {str(e)}")