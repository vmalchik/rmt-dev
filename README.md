# Cloned

1. Create a new repository at github.com. (this is your repository)

- Give it the same name as the other repository.
- Don't initialize it with a README, .gitignore, or license.

2. Clone the other repository to your local machine. (if you haven't done so already)

- git clone https://github.com/other-account/other-repository.git

3. Rename the local repository's current 'origin' to 'upstream'.

- git remote rename origin upstream

4. Give the local repository an 'origin' that points to your repository.

- git remote add origin https://github.com/your-account/your-repository.git

5. Push the local repository to your repository on github.

- git push origin main

Based on [reference](https://stackoverflow.com/questions/18200248/cloning-a-repo-from-someone-elses-github-and-pushing-it-to-a-repo-on-my-github)
