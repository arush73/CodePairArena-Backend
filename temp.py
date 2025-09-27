# import json

# with open("leet-rosetta-real.json", "r", encoding="utf-8") as f:
#     data = json.load(f)  # data is a list of objects

# # Ye tera original JSON object
# for obj in data:
#     if "code" in obj:
#         cleaned_code = {}
#         for lang, code in obj["code"].items():
#             lines = code.split("\n")
#             # First line remove if starts with ```
#             if lines[0].startswith("```"):
#                 lines = lines[1:]
#             # Last line remove if is ```
#             if lines[-1].strip() == "```":
#                 lines = lines[:-1]
#             cleaned_code[lang] = "\n".join(lines)
#         obj["code"] = cleaned_code

# with open("cleaed-rosetta.json", "w", encoding="utf-8") as f:
#     json.dump(data, f, indent=4, ensure_ascii=False)

# print("✅ All code blocks cleaned and saved to output.json")

# # Processed dictionary
# # cleaned_data = {}

# # for lang, code in data.items():
# #     # Remove first line if it starts with ```
# #     lines = code.split("\n")
# #     if lines[0].startswith("```"):
# #         lines = lines[1:]
# #     # Remove last line if it is ```
# #     if lines[-1].strip() == "```":
# # #         lines = lines[:-1]
# # #     cleaned_data[lang] = "\n".join(lines)

# # # Agar print karna ho
# # for lang, code in cleaned_data.items():
# #     print(f"---{lang}---")
# #     print(code)
# #     print()


import json

with open("leet-rosetta-real.json", "r", encoding="utf-8") as f:
    data = json.load(f)  # data is a list of objects

for obj in data:
    if "code" in obj:
        cleaned_code = {}
        for lang, code in obj["code"].items():
            lines = code.split("\n")
            if lines:
                # First line remove if starts with ```
                if lines[0].startswith("```"):
                    lines = lines[1:]
                # Last line remove if is ```
                if lines and lines[-1].strip() == "```":
                    lines = lines[:-1]
                cleaned_code[lang] = "\n".join(lines)
            else:
                cleaned_code[lang] = ""
        obj["code"] = cleaned_code

with open("cleaed-rosetta.json", "w", encoding="utf-8") as f:
    json.dump(data, f, indent=4, ensure_ascii=False)

print("✅ All code blocks cleaned and saved to cleared-rosetta.json")
