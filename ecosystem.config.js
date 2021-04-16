module.exports = {
    apps : [
        {
            name: "unitebot",
            script: "./unitbot.js",
            watch: true,
            instances: 42,
           // exec_mode: "cluster",
            env: {
                "PORT": 3000,
                "NODE_ENV": "development"
            }
        }
    ]
}