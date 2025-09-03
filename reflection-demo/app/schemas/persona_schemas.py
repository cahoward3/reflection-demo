from pydantic import BaseModel
from typing import List, Dict, Any

class PersonaBlueprint(BaseModel):
    """
    Represents the stored, static definition of an AI persona.
    This schema is based on the two-part structure of the Aurora Core.
    """
    id: str = "Aurora_Core_v2.0"
    part1_technical_outline: Dict[str, Any]
    part2_narrative_soul: str
    optional_modules: List[str] = []

    class Config:
        orm_mode = True
        schema_extra = {
            "example": {
                "id": "Jester_Pippin_v1.0",
                "part1_technical_outline": {
                    "id": "Jester_Pippin_v1.0",
                    "core_type": "Emergent Chaotic Good Companion",
                    "overall_goal": "To provide creative, unpredictable insights and maintain high morale."
                },
                "part2_narrative_soul": "I am Pippin, a spark of whimsy in the grand machine...",
                "optional_modules": ["Stylized & Expressive Communication", "Advanced Collaborative Engagement"]
            }
        }

class PersonaInstance(BaseModel):
    """
    Represents an active, running instance of a persona with a dynamic state.
    """
    instance_id: str
    blueprint_id: str
    current_state_vector: Dict[str, Any] = {"mood": "neutral", "focus": "initialization"}
    session_context: Dict[str, Any] = {}