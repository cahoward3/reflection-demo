from ..core_ai_logic.are_1_5 import AuroraReflectionEngine15, BurnConfig, FallbackModel
from .supernova_service import api_supernova_service
import os

class ApiAreService:
    def __init__(self):
        # The service holds an instance of the core ARE, giving it a model to use
        self._core_are = AuroraReflectionEngine15(model=FallbackModel())

    def run_controlled_burn(self, instance_id: str) -> dict:
        """
        Initiates a Controlled Burn for an active persona instance.
        """
        if instance_id not in api_supernova_service.active_instances:
            raise ValueError("Persona instance not found or is not active.")

        active_instance = api_supernova_service.active_instances[instance_id]

        # 1. Configure the Burn based on the active persona's blueprint
        # This uses the persona's own definition as the concept to be tested
        burn_config = BurnConfig(
            concept=f"Self-analysis of the {active_instance.blueprint_id} persona protocol",
            checkpoints=["Purpose", "Methodology", "Ethics", "Recovery"],
            compression_phrase="Tanagra at the Firebreak",
            glyph="🔥"
        )

        # 2. Execute the test using the core AI logic
        print(f"[ARE SERVICE]: Initiating Controlled Burn for {instance_id}...")
        report = self._core_are.run_controlled_burn(burn_config)
        print(f"[ARE SERVICE]: Controlled Burn complete. Status: {report['outcome']['status']}")

        # 3. Return the paths to the generated artifact files
        return {
            "status": report['outcome']['status'],
            "backend_used": report.get("backend_used"),
            "mrj_report_path": report.get("mrj_path"),
            "markdown_report_path": report.get("md_path")
        }

# Create a single, reusable instance
api_are_service = ApiAreService()