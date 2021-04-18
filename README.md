# Docker Fundamentals

https://www.youtube.com/watch?v=CYyUCJad954&list=PLRAV69dS1uWTJLvDP4Veld5F05rJAmOcp

https://www.youtube.com/watch?v=pTFZFxd4hOI&ab_channel=ProgrammingwithMosh

`docker version` will show you the version that is installed in your system. It will show the version for both client and server, the server version will be shown only if the docker is running on the your machine.


![image](https://user-images.githubusercontent.com/21096850/114256102-8c8cfb00-99d7-11eb-8c6f-ee550e6871b5.png)


## Development workflow.
To dockerise a application we just have to add a `Dockerfile` in it. A `Dockerfile` is a set of instructions that docker uses to package this application into an image. This image contains everything that our package need in order to run. i.e
1) A Cut Down OS.
2) A runtime environment (eg Node)
3) Application Files
4) Third party libraries.
5) Environment Variables etc.

One we have an image we tell docker to start the container using that image. A container is just an process which has it's own filesystem provided by the image, so our application is loaded inside our container. This is how we run our application in our machine.

This image can be pushed to the docker just like we push our code to the git. Once the application is in the dockerhub we can pull it in any machine i.e on production or test.


## Two Most Important Things (Images and Container)
Images are the blue print for container, It's actually the images the contains everything that is required to run the code. Image is a sharable package with all the setup instruction and the container is a running instance of such image.

### (Pre built or Existing Image on Docker Hub)

```
docker run node //

docker run -it node // run docker on interative mode.
```

### (Build you own Image: NODE JS Example)

```Dockerfile

FROM node

WORKDIR /app

COPY package.json /app # Copying the package.json file first because we don't want to run npm install command even when the internal code changes.

RUN npm install 

COPY . /app 

EXPOSE 80 # Since the docker environment in isolated and has it's own internal network. Therefore the internal port has to be exposed to our local system.

# RUN node server.js # Incorrect because we don't want to run th server in a image we want to do that in container.  We only want to start a server if you starta container based on that image. Therefore use CMD insteand of RUN.

CMD ["node", "server.js"]
```

Now run the `docker build .` in the folder where your `Dockerfile` is. This will build your image.

Finally you can run the `docker run -p 3000:80 image_name`. Here you also specify the port 3000 which will mapped to the docker exposed port 80.

Now you can browser your node app on `localhost:3000`.

Stop the container with `docker stop container_name`


**NOTE:** However This image build will not build the code everytime you change your code. You will have to `docker build .` to rebuild this image and `docker run -p 3000:80  new_image`


**COPY . /app** 
Here the `COPY . /app` means copy the first path is outside of the image where the file lives and that should be copied into the image. this is basically the project's root folder containing the Dockerfile excluding the Dockerfile. All the folder / sub folder and files in the ./ directory should be copied into the image i.e /app directory which is inside the image. every container has it's own internal filesystem which is totally detached from your file system and is hidden away inside the docker container. The /app folder will be created if it does not exists.

**WORKDIR /app**
All the commands should be executed in the /app folder inside the container.


## Managing Images & Container.

1) `docker ps` to list the running container `docker ps -a` to list also the stopped container.
2) `docker start [image_name]` to restart the container because there is no need to create new container everytime if nothing has changed.
3) `docker run -p 8000:80 -d [image_name]` to start the container in detach mode. Detach mode does not keep listening in the terminal even if the application is running. The defauld mode is `attach` when running the run command.
4) `docker attach [image_name]` to attach yourself in the running container.
5) `docker logs [image_name]` to view the `console.log` in detached mode. Also `docker logs -f [image_name]` show log and keep on listening -f is follow. 
6) `docker run -it image_name` to run the image in interactive mode i.e you can also input the data if the app is listening for your input via terminal.
7) `docker rm container_name1 container_name2 contaier_name3` to remove the container. You will have to stop the container first.
8) `docker images` to list the images that were built.
9) `docker rmi image_nme` to remove images. You must delete the container before you delete the image or you can do `--force`
10) `docker image prune` to remove all the unused images.
11) Add `--rm` in the run command to rm the docker automatically when it stops. `docker run -p 3000:80 -d --rm image_name`. `docker stop` will also delete  the container.
12) `docker image inspect image_id` to view addditional information about the image.
13) `docker cp` Add folder/file to a running container with `docker copy dummy/. container_name:/path_where_to_copy` you can also copy folder/file from docker to your system `docker cp container_name:/path/file local_folder` this will help
14) Docker Name with `--name`. Build image with detach mode and rm on stop and with a name `docker run -p 3000:80 -d --rm --name selvesan image_name`
15) A image name has two part name and tag `name:tag` eg: `node:14`. Build a image with name and a tag `docker build -t selvesan:latest .`. The tag name can be nuber or string. Now you can run the image with the name `docker run -p 3000:80 -d -rm --name contaier_name selvesan:latest`
16) `docker image prune -a` to delete all the images.



## Dockerise Python

```Dockerfile
FROM python
WORKDIR /app

COPY . /app

CMD ["python", "file.py"]
```

Run `docker build .` and `docker run -it image_name`




## Sharing Images

1) Create account in docker hub
2) Create a repository
3) The newly create repository will give you a command to push into that repository. `docker push selvesan/node-app`
4) The docker image's name should be the repositories name `docker tag old_name selvesan/node-app`. Here we are renaming the already available image.
5) `docker login` to login from the terminal
6) Finally `docker push selvesan/node-app`
7) `docker pull selvesan/node-app` to pull the docker image. Run the same pull command to update the docker image.



## Managing Data/Volumes in Images and Container
Three kinds of data are
1) Application (Code / Environment) which is added to the container when the container is built and is Fixed cannot be changed once the container is built. This can be readonly because it is stored in image.
2) Temporary Data (User input value stored in a variable) stored in memory or temporary files which is dynamic and changing but cleared regularly. This can be read / write because it is stored in container.
3) Data that need to be persist data should be there even if the container stops. (Database stored data). Can be read/write and stored in container and volumes.

### Example Node App for Data/Volume Management (V41/V42)
![image](https://user-images.githubusercontent.com/21096850/115122164-3bcc6200-9fd6-11eb-9aaa-cca602729b71.png)

Here the `temp` folder will contain the file that was created for temporary storage of form inputed data. The `temp's` file will be moved to the `feedback` folder to be saved permanently.

#### Dockerising this example
```Dockerfile
FROM node:14

WORKDIR /app

COPY package.json .

RUN npm install

COPY . .

EXPOSE 80

COMMAND ["node" , "server"]
```

`docker build . -t feedback-node` to build the image and `docker run -p 3000:80 -d --name feed-app --rm feedback-node`

#### Volumes
Volumes are the folder on your host machine (Your Computer) which are mounted into containers. With volume you can map folder outside on a container to inside of a container so adding file to this folder container can access it and file added by the container we can access it. Because of this container allows us to persist data. Note: The volume must be named in order for it to survive because named volumn are not attached to container therefore it wonn't get deleted when the container stops.

To create a named volumn `docker run -d -p 3000:80 --rm --name feedback-app -v feedback_storage:/app/feedback image_name`. Here `-v volumn_name:/volume/path` is defining a volumn in a path inside container.



#### Bind Mountes
The subsequent changes in the code would reflect in the image unless we manually build the image again. We always have to build the image and restart the container everytime we make the change.
Here's where the bind mount will help us. Bind mounte are perfect for persistance and editable data. 

`docker run -d --rm -p 3000:80 --name feedback-app -v feedback:/app/feedback -v "/Users/path/to/your/app:/app" -v /app/node_modules image_name`

1) the first volume `-v feedback:/app/feedback` is to make the saved feedback persists and also link our local system feedback folder to docker's /app/feedback
2) the second volume `-v "/Users/path/to/your/app:/app"` is to make the docker internal volume mounted to our local folder to reflect the changes as we make changes to the code
3) the third volume `-v /app/node_modules` is a anonymous volume created just to ignore the replacement of `node_modules` when the localstorage is mounted in docker's `/app` directory


Overview
1) Anonymos volumes  is created for a container and is removed when the container is stoped.
2) Named volumes cannot be created in the Dockerfile should be created with the `-v` flag when running the container. Is not tied to a container
3) In Bind Mounts we know where the data is stored in host machine 

#### Readonly Volume.




######################################################

Now hit `-t hello-docker .` to create an image based on the instruction mentioned on the `Dockerfile` in the `.` directory.

Finally `docker run -p 3000:80 hello-docker`. Here -p is published and 3000 is the local port under which you want to access this application and 80 is the docker container expose port

Close the container `docker stop hello-docker`. `docker ps` to find the container name. `docker start container-name` to restart the stopped container because there is no need of creating contaner everytime.

`docker run -p 3000:80 -d hello-docker` to start the container in detach mode. `docker attach hello-docker` to attach the detached container. `docker log -f container-name` to see the log of a detached container.



1) mkdir `docker-example` && cd `docker-example`.
2) create a `index.js` file and `console.log("Hello world")`.
3) create a `Dockerfile` inside the root directory.

```Dockerfile
FROM node:alpine # minimalist version of node
COPY . /app # copy everything from current working directory into the app folder
WORKDIR /app # set the working directory here we have everything inside the app directory when you set the working direcotry every command is expected to be executed inside the WORKDIR.

CMD node app.js # 
```

**Now we can build our application in docker**
`docker build -t hello-docker .`
Here `-t` is a tag to identify the project and `.` is the folder location where the `Dockerfile` is located.

This command will build an docker image for our project. To see the built image `docker image ls`.

Now that we have build this image we can run this image on any computer using docker with `docker run hello-docker`. We can also publish this image on docker hub so that anyone can use this image.


## Play With Docker.

You can also run this image on `play with docker` [Play with Docker](https://labs.play-with-docker.com)
1) `docker version`
2) `docker pull selvesan/docker101tutorial`
3) verify the image was pulled with `docker images ` || `docker image ls`


## Images
Images are used behind the scenes to hold all the logic and all the code that container needs and then we create instances of the image with the `run` command. Container are the running instannces of those images.

### Ubuntu Image.
1) `docker run ubuntu` This command will run the ubuntu image if it's available on your system and if it's not available it will simply run the command `docker pull ubuntu`
2) `docker ps` to view the running container. `docker ps -a` to view the running container as well as the stopped container.
3) `docker run -it ubuntu`. Here the `-it` means the interactive mode.





