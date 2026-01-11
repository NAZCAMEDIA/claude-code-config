import requests
import json
import sys

MCP_URL = "http://localhost:31126/mcp"

def rpc_call(method, params=None):
    payload = {
        "jsonrpc": "2.0",
        "id": 1,
        "method": method,
        "params": params or {}
    }
    try:
        response = requests.post(MCP_URL, json=payload, headers={"Content-Type": "application/json", "Accept": "application/json"})
        if response.status_code != 200:
             return {"error": f"Status {response.status_code}", "body": response.text}
        return response.json()
    except Exception as e:
        return {"error": str(e)}

def list_tools():
    return rpc_call("tools/list")

def call_tool(name, args):
    return rpc_call("tools/call", {"name": name, "arguments": args})

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python3 mcp_client.py <list|call> [tool_name] [json_args]")
        sys.exit(1)

    cmd = sys.argv[1]
    
    if cmd == "list":
        result = list_tools()
        print(json.dumps(result, indent=2))
    elif cmd == "call":
        if len(sys.argv) < 4:
            print("Usage: python3 mcp_client.py call <tool_name> <json_args_or_file>")
            sys.exit(1)
        tool_name = sys.argv[2]
        arg_input = sys.argv[3]
        
        try:
            # Try parsing as JSON first
            args = json.loads(arg_input)
        except json.JSONDecodeError:
            # If not JSON, assume it's a file path containing the script for 'run_code'
            # This is a convenience for the 'run_code' tool specifically
            if tool_name == "run_code":
                try:
                    with open(arg_input, 'r') as f:
                        script_content = f.read()
                    args = {"script": script_content}
                except Exception as e:
                    print(f"Error reading script file: {e}")
                    sys.exit(1)
            else:
                 print("Error: Arguments must be valid JSON")
                 sys.exit(1)

        result = call_tool(tool_name, args)
        print(json.dumps(result, indent=2))
