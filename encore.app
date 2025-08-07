{
  "id": "devotional-guide",
  "experiments": ["encore.dev/experiments/devdash"],
  "global": {
    "cors": {
      "allow_origins_with_credentials": ["http://localhost:8080", "https://*.lp.dev"]
    }
  },
  "deploy": {
    "env": {
      "PORT": "8080"
    }
  }
}
