@echo off
setlocal
REM GITLAB�R���e�i��Windows��Docker Desktop���T�|�[�g���Ă��Ȃ�
REM WSL�ɂ��Linux����Docker���N������
REM WSL2���ݒ莞�� https://footloose-engineer.com/blog/2022/05/02/wsl2-ubuntu-docker-compose-setup/
REM wsl --install

cd /d %~dp0
REM �ݒ�
set DIST=Ubuntu
set GITLAB_IMAGE=gitlab/gitlab-ce:15.6.8-ce.0
set GITLAB_CONTAINER_NAME=gitlab
set GITLAB_HOME=/srv/gitlab

set GITLAB_WEB_IP=127.0.0.1
set GITLAB_WEB_PORT=8080
set GITLAB_SHELL_PORT=8022

REM �����ݒ�
wsl --install -d %DIST%

@REM REM Docker �ŐV��
@REM wsl -d %DIST% -e sudo apt-get update
@REM wsl -d %DIST% -e sudo apt-get install docker-ce docker-ce-cli containerd.io docker-compose-plugin

REM �ċN�����Ȃ���GITLAB�N�����s����
wsl -d %DIST% -e sudo service docker stop
wsl -d %DIST% -e sudo service docker start

REM Container �N��
wsl -d %DIST% -e sudo docker run --detach ^
    --hostname %GITLAB_WEB_IP% ^
    --publish %GITLAB_WEB_PORT%:80 ^
    --publish %GITLAB_SHELL_PORT%:22 ^
    --name %GITLAB_CONTAINER_NAME% ^
    --env GITLAB_SKIP_UNMIGRATED_DATA_CHECK="true" ^
    --env GITLAB_OMNIBUS_CONFIG="external_url 'http://%GITLAB_WEB_IP%:%GITLAB_WEB_PORT%/';gitlab_rails['gitlab_shell_ssh_port'] = %GITLAB_SHELL_PORT%; nginx['listen_port'] = 80" ^
    --volume %GITLAB_HOME%/config:/etc/gitlab ^
    --volume %GITLAB_HOME%/logs:/var/log/gitlab ^
    --volume %GITLAB_HOME%/data:/var/opt/gitlab ^
    --shm-size 256m ^
    --restart always ^
    %GITLAB_IMAGE%

@REM REM WSL���̃R���e�i�ɃR�s�[
@REM wsl -d %DIST% -e sudo docker cp to_gitlab_container %GITLAB_CONTAINER_NAME%:./

REM �N����҂�
REM wsl -d %DIST% -e sudo docker logs -f %GITLAB_CONTAINER_NAME%
wsl -d %DIST% -e ./check_gitlab_started.sh

REM �N����̃��b�Z�[�W
echo �ڑ���F http://%GITLAB_WEB_IP%:%GITLAB_WEB_PORT%/
echo root�p�X���[�h�F
wsl -d %DIST% -e "cat %GITLAB_HOME%/config/initial_root_password | grep Password"

endlocal