const dependencies =

[
    {
        "id": 201,
        "trigger": "no",
        "action": "disable",
        "dependencies": "202; 203"
    },
    {
        "id": 202,
        "trigger": "no",
        "action": "disable",
        "dependencies": "203; 204"
    }
]

module.exports = dependencies;