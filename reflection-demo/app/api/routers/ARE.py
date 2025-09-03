from fastapi import APIRouter, HTTPException
from ...services.are_service import api_are_service

router = APIRouter()

@router.post("/run_burn/{instance_id}")
def run_burn_endpoint(instance_id: str):
    """
    Triggers a Controlled Burn test for an active persona instance.
    """
    try:
        report_paths = api_are_service.run_controlled_burn(instance_id)
        return report_paths
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal Error during Controlled Burn: {str(e)}")