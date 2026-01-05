FROM nodejs/devcontainer:nightly

USER root

RUN useradd --shell /bin/bash --create-home vscode || true \
    && echo "vscode ALL=(ALL) NOPASSWD:ALL" > /etc/sudoers.d/vscode \
    && chmod 0440 /etc/sudoers.d/vscode

COPY ./scripts/setup-postgres.sh /usr/local/bin/setup-postgres
RUN chmod +x /usr/local/bin/setup-postgres \
    && /usr/local/bin/setup-postgres

USER vscode
