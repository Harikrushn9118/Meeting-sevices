# AI Approach

## Prompt Design
The prompt explicitly asks the LLM to act as a transcript analyzer. It provides the exact JSON schema it needs to return and emphasizes the word "CRITICAL" to ensure the model follows the citation requirement. 

## Citation Strategy
The prompt requires that every generated insight includes a `citations` array. The objects inside this array must have a `timestamp` field that exactly matches a timestamp found in the provided transcript.

## Hallucination Prevention Approach
By instructing the model to return "ONLY valid JSON" and strictly enforcing that citations must map back to the transcript, we reduce the chance of the model inventing information. If an event doesn't have a timestamp, the model shouldn't include it.

## Output Validation Strategy
The response is parsed as JSON. We do a basic string replacement to remove Markdown formatting (like ```json ... ```) that some models return by default. In a production scenario, we would use a library like Zod or Joi to validate the schema before saving it.

## Known Limitations
- If the transcript is extremely long, it might exceed the token limit of the model.
- The model might occasionally fail to format the JSON correctly despite the instructions, which would cause a parsing error.
