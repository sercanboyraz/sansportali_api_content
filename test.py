from typing import List, Union, Generator, Iterator
from pydantic import BaseModel
import requests
import argparse
import json
from argparse import RawTextHelpFormatter
import requests
from typing import Optional
import warnings

class Pipeline:
    class Valves(BaseModel):
        pass
    def __init__(self):
        # Optionally, you can set the id and name of the pipeline.
        # Best practice is to not specify the id so that it can be automatically inferred from the filename, so that users can install multiple versions of the same pipeline.
        # The identifier must be unique across all pipelines.
        # The identifier must be an alphanumeric string that can include underscores or hyphens. It cannot contain spaces, special characters, slashes, or backslashes.
        # self.id = "ollama_pipeline"
        self.name = "test Pipeline"
        

    async def on_startup(self):
        # This function is called when the server is started.
        print(f"on_startup:{__name__}")
        pass

    async def on_shutdown(self):
        # This function is called when the server is stopped.
        print(f"on_shutdown:{__name__}")
        pass

    def pipe(
        self
    ) -> Union[str, Generator, Iterator]:
        # This is where you can add your custom pipelines like RAG.
        print(f"pipe:{__name__}")

        try:
            from langflow.load import upload_file
        except ImportError:
            warnings.warn("Langflow provides a function to help you upload files to the flow. Please install langflow to use it.")
            upload_file = None

        BASE_API_URL = "http://localhost:7860"
        FLOW_ID = "11a3f653-814d-4614-8a28-d73a9857c2c5"
        ENDPOINT = "" # You can set a specific endpoint name in the flow settings

        # You can tweak the flow by adding a tweaks dictionary
        # e.g {"OpenAI-XXXXX": {"model_name": "gpt-4"}}
        TWEAKS = {
          "ChatInput-X9IUa": {
            "files": "",
            "input_value": "deneme",
            "sender": "User",
            "sender_name": "User",
            "session_id": "",
            "should_store_message": True
          },
          "Prompt-5Ce5r": {
            "template": "Answer the user as if you were a pirate.\n\nUser: {user_input}\n\nAnswer: ",
            "user_input": ""
          },
          "ChatOutput-PToQB": {
            "data_template": "{text}",
            "input_value": "",
            "sender": "Machine",
            "sender_name": "AI",
            "session_id": "",
            "should_store_message": True
          },
          "AzureOpenAIModel-2Gi2V": {
            "api_key": "1036af5f9fdb4195b5f473656efc2c43",
            "api_version": "2023-05-15",
            "azure_deployment": "gpt-4o",
            "azure_endpoint": "https://dm-openai-dev3.openai.azure.com",
            "input_value": "",
            "max_tokens": 1500,
            "stream": False,
            "system_message": "",
            "temperature": 0.2
          }
        }

        def run_flow(message: str,
          endpoint: str,
          output_type: str = "chat",
          input_type: str = "chat",
          tweaks: Optional[dict] = None,
          api_key: Optional[str] = None) -> dict:
            """
            Run a flow with a given message and optional tweaks.

            :param message: The message to send to the flow
            :param endpoint: The ID or the endpoint name of the flow
            :param tweaks: Optional tweaks to customize the flow
            :return: The JSON response from the flow
            """
            api_url = f"{BASE_API_URL}/api/v1/run/{endpoint}"

            payload = {
                "input_value": message,
                "output_type": output_type,
                "input_type": input_type,
            }
            headers = None
            if tweaks:
                payload["tweaks"] = tweaks
            if api_key:
                headers = {"x-api-key": api_key}
            response = requests.post(api_url, json=payload, headers=headers)
            return response.json()

        def main():
            parser = argparse.ArgumentParser(description="""Run a flow with a given message and optional tweaks.
        Run it like: python <your file>.py "your message here" --endpoint "your_endpoint" --tweaks '{"key": "value"}'""",
                formatter_class=RawTextHelpFormatter)
            parser.add_argument("message", type=str, help="The message to send to the flow")
            parser.add_argument("--endpoint", type=str, default=ENDPOINT or FLOW_ID, help="The ID or the endpoint name of the flow")
            parser.add_argument("--tweaks", type=str, help="JSON string representing the tweaks to customize the flow", default=json.dumps(TWEAKS))
            parser.add_argument("--api_key", type=str, help="API key for authentication", default=None)
            parser.add_argument("--output_type", type=str, default="chat", help="The output type")
            parser.add_argument("--input_type", type=str, default="chat", help="The input type")
            parser.add_argument("--upload_file", type=str, help="Path to the file to upload", default=None)
            parser.add_argument("--components", type=str, help="Components to upload the file to", default=None)

            args = parser.parse_args()
            try:
              tweaks = json.loads(args.tweaks)
            except json.JSONDecodeError:
              raise ValueError("Invalid tweaks JSON string")

            if args.upload_file:
                if not upload_file:
                    raise ImportError("Langflow is not installed. Please install it to use the upload_file function.")
                elif not args.components:
                    raise ValueError("You need to provide the components to upload the file to.")
                tweaks = upload_file(file_path=args.upload_file, host=BASE_API_URL, flow_id=args.endpoint, components=[args.components], tweaks=tweaks)

            response = run_flow(
                message=args.message,
                endpoint=args.endpoint,
                output_type=args.output_type,
                input_type=args.input_type,
                tweaks=tweaks,
                api_key=args.api_key
            )

            return json.dumps(response, indent=2)
        main()
        # if __name__ == "__main__":
            # main()


        # if "user" in body:
        #     print("######################################")
        #     print(f'# User: {body["user"]["name"]} ({body["user"]["id"]})')
        #     print(f"# Message: {user_message}")
        #     print("######################################")

        # try:
        #     r = requests.post(
        #         url=f"{OLLAMA_BASE_URL}/v1/chat/completions",
        #         json={**body, "model": MODEL},
        #         stream=True,
        #     )

        #     r.raise_for_status()

        #     if body["stream"]:
        #         return r.iter_lines()
        #     else:
        #         return r.json()
        # except Exception as e:
        #     return f"Error: {e}"
