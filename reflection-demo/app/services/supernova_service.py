from ..core_ai_logic.supernova_orchestrator_v1_1 import SupernovaOrchestrator as CoreOrchestrator
from ..schemas.persona_schemas import PersonaInstance
from ..core_ai_logic.are_1_5 import FallbackModel

class ApiSupernovaService:
    def __init__(self):
        # The service holds the core AI orchestrator logic
        # We pass it a model instance for it to use for generating responses
        self._core_orchestrator = CoreOrchestrator(model=FallbackModel())
        
        # This dictionary will keep track of all active persona instances in memory
        self.active_instances: dict[str, PersonaInstance] = {}

    def register_instance(self, instance: PersonaInstance):
        """Adds a newly created persona instance to the active roster."""
        print(f"[SUPERNOVA]: Registering new active instance: {instance.instance_id}")
        self.active_instances[instance.instance_id] = instance

    def process_turn(self, instance_id: str, user_query: str) -> str:
        """
        Handles a single conversational turn for a specific persona instance.
        """
        if instance_id not in self.active_instances:
            raise ValueError("Persona instance not found or is not active.")

        active_instance = self.active_instances[instance_id]
        
        # This mimics the logic from your orchestrator script's get_full_prompt method
        # In a real build, we would refactor the core logic to be called directly
        context_str = "\n".join([f"- {k}: {v}" for k, v in active_instance.session_context.items()])
        state_str = "\n".join([f"- {k}: {v}" for k, v in active_instance.current_state_vector.items()])
        
        full_prompt = f"""
        **System Directive:** Embody the {active_instance.blueprint_id} persona.
        **Your Current Internal State Vector:**\n{state_str}
        **Shared Interaction Context:**\n{context_str}
        **User Query:**\n{user_query}
        **Your Response (as {active_instance.blueprint_id}):**
        """
        
        # Call the core AI model to generate a response
        response_text = self._core_orchestrator.model.generate(full_prompt)
        
        # Update session context (a simple example)
        active_instance.session_context["last_speaker"] = "user"
        active_instance.session_context["last_user_query"] = user_query
        
        return response_text

# Create a single, reusable instance for the API
api_supernova_service = ApiSupernovaService()