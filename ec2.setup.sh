setup_steps() {
    sudo ufw defult deny incoming
    sudo ufw default allow outgoing
    sudo ufw allow OpenSSH
    sudo ufw allow 80
    sudo ufw allow 443
    sudo ufw show added
    sudo ufw enable
    sudo ufw status

    # sudo apt install nginx

    # sudo apt-get remove certbot
    # sudo snap install --classic certbot
    # sudo certbot --nginx
    # sudo certbot renew --dry-run

    sudo apt update -y && sudo apt upgrade -y

    for pkg in docker.io docker-doc docker-compose docker-compose-v2 podman-docker containerd runc; do sudo apt-get remove $pkg; done
    # Add Docker's official GPG key:
    sudo apt-get update
    sudo apt-get install ca-certificates curl
    sudo install -m 0755 -d /etc/apt/keyrings
    sudo curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc
    sudo chmod a+r /etc/apt/keyrings/docker.asc

    # Add the repository to Apt sources:
    echo \
        "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/ubuntu \
  $(. /etc/os-release && echo "${UBUNTU_CODENAME:-$VERSION_CODENAME}") stable" |
        sudo tee /etc/apt/sources.list.d/docker.list >/dev/null
    sudo apt-get update

    sudo apt-get install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

    read -p "Enter Repo Path e.g. ChibaLLC/manyumba: " path
    read -p "Enter your GitHub username: " username
    read -s -p "Enter your GitHub access token: " token
    echo


    repo_name=$(basename "$path")
    if [ -d "$repo_name" ]; then
        echo "Directory $repo_name exists. Pulling latest changes..."
        cd "$repo_name"
        git pull
    else
        git clone https://$username:$token@github.com/$path.git
        cd "$repo_name"
    fi

    sudo service docker start
    echo "Setup done, now run with: sudo docker compose up"
}

if [ "$(id -u)" -eq 0 ]; then
    echo "You are running as root."
    read -p "Would you like to create a non-root user for setup? (y/n): " create_user
    if [[ "$create_user" =~ ^[Yy]$ ]]; then
        read -p "Enter new username: " newuser
        sudo adduser "$newuser"
        sudo usermod -aG sudo "$newuser"
        sudo usermod -aG docker "$newuser"
        echo "Switching to user $newuser..."
        sudo -i -u "$newuser" bash -c "$(declare -f setup_steps); setup_steps"
        exit 0
    else
        echo "WARNING: Proceeding as root is not recommended for security reasons."
    fi
fi

setup_steps
