FROM nodejs/devcontainer:nightly

USER root

RUN useradd --shell /bin/bash --create-home vscode || true \
    && echo "vscode ALL=(ALL) NOPASSWD:ALL" > /etc/sudoers.d/vscode \
    && chmod 0440 /etc/sudoers.d/vscode

COPY ./scripts/setup-postgres.sh /usr/local/bin/setup-postgres.sh
RUN chmod +x /usr/local/bin/setup-postgres.sh \
    && /usr/local/bin/setup-postgres.sh

USER vscode
