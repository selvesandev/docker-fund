# Docker Fundamentals

https://www.youtube.com/watch?v=CYyUCJad954&list=PLRAV69dS1uWTJLvDP4Veld5F05rJAmOcp

https://www.youtube.com/watch?v=pTFZFxd4hOI&ab_channel=ProgrammingwithMosh

`docker version` will show you the version that is installed in your system. It will show the version for both client and server, the server version will be shown only if the docker is running on the your machine.

![image](https://user-images.githubusercontent.com/21096850/114256102-8c8cfb00-99d7-11eb-8c6f-ee550e6871b5.png)

## Development workflow.

To dockerise a application we just have to add a `Dockerfile` in it. A `Dockerfile` is a set of instructions that docker uses to package this application into an image. This image contains everything that our package need in order to run. i.e

1. A Cut Down OS.
2. A runtime environment (eg Node)
3. Application Files
4. Third party libraries.
5. Environment Variables etc.

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

**NOTE:** However This image build will not build the code everytime you change your code. You will have to `docker build .` to rebuild this image and `docker run -p 3000:80 new_image`

**COPY . /app**
Here the `COPY . /app` means copy the first path is outside of the image where the file lives and that should be copied into the image. this is basically the project's root folder containing the Dockerfile excluding the Dockerfile. All the folder / sub folder and files in the ./ directory should be copied into the image i.e /app directory which is inside the image. every container has it's own internal filesystem which is totally detached from your file system and is hidden away inside the docker container. The /app folder will be created if it does not exists.

**WORKDIR /app**
All the commands should be executed in the /app folder inside the container.

## Managing Images & Container.

1. `docker ps` to list the running container `docker ps -a` to list also the stopped container.
2. `docker start [image_name]` to restart the container because there is no need to create new container everytime if nothing has changed.
3. `docker run -p 8000:80 -d [image_name]` to start the container in detach mode. Detach mode does not keep listening in the terminal even if the application is running. The defauld mode is `attach` when running the run command.
4. `docker attach [image_name]` to attach yourself in the running container.
5. `docker logs [image_name]` to view the `console.log` in detached mode. Also `docker logs -f [image_name]` show log and keep on listening -f is follow.
6. `docker run -it image_name` to run the image in interactive mode i.e you can also input the data if the app is listening for your input via terminal.
7. `docker rm container_name1 container_name2 contaier_name3` to remove the container. You will have to stop the container first.
8. `docker images` to list the images that were built.
9. `docker rmi image_nme` to remove images. You must delete the container before you delete the image or you can do `--force`
10. `docker image prune` to remove all the unused images.
11. Add `--rm` in the run command to rm the docker automatically when it stops. `docker run -p 3000:80 -d --rm image_name`. `docker stop` will also delete the container.
12. `docker image inspect image_id` to view addditional information about the image.
13. `docker cp` Add folder/file to a running container with `docker copy dummy/. container_name:/path_where_to_copy` you can also copy folder/file from docker to your system `docker cp container_name:/path/file local_folder` this will help
14. Docker Name with `--name`. Build image with detach mode and rm on stop and with a name `docker run -p 3000:80 -d --rm --name selvesan image_name`
15. A image name has two part name and tag `name:tag` eg: `node:14`. Build a image with name and a tag `docker build -t selvesan:latest .`. The tag name can be nuber or string. Now you can run the image with the name `docker run -p 3000:80 -d -rm --name contaier_name selvesan:latest`
16. `docker image prune -a` to delete all the images.

## Dockerise Python

```Dockerfile
FROM python
WORKDIR /app

COPY . /app

CMD ["python", "file.py"]
```

Run `docker build .` and `docker run -it image_name`

## Sharing Images

1. Create account in docker hub
2. Create a repository
3. The newly create repository will give you a command to push into that repository. `docker push selvesan/node-app`
4. The docker image's name should be the repositories name `docker tag old_name selvesan/node-app`. Here we are renaming the already available image.
5. `docker login` to login from the terminal
6. Finally `docker push selvesan/node-app`
7. `docker pull selvesan/node-app` to pull the docker image. Run the same pull command to update the docker image.

## Managing Data/Volumes in Images and Container

Three kinds of data are

1. Application (Code / Environment) which is added to the container when the container is built and is Fixed cannot be changed once the container is built. This can be readonly because it is stored in image.
2. Temporary Data (User input value stored in a variable) stored in memory or temporary files which is dynamic and changing but cleared regularly. This can be read / write because it is stored in container.
3. Data that need to be persist data should be there even if the container stops. (Database stored data). Can be read/write and stored in container and volumes.

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

1. the first volume `-v feedback:/app/feedback` is to make the saved feedback persists and also link our local system feedback folder to docker's /app/feedback
2. the second volume `-v "/Users/path/to/your/app:/app"` is to make the docker internal volume mounted to our local folder to reflect the changes as we make changes to the code
3. the third volume `-v /app/node_modules` is a anonymous volume created just to ignore the replacement of `node_modules` when the localstorage is mounted in docker's `/app` directory

Overview

1. Anonymos volumes is created for a container and is removed when the container is stoped.
2. Named volumes cannot be created in the Dockerfile should be created with the `-v` flag when running the container. Is not tied to a container
3. In Bind Mounts we know where the data is stored in host machine

#### Readonly Volume.

.....

## Networking and Cross Cotainer.

1. How you can connect to multiple containers
2. How you can let them talk to each other.
3. Also how you can connect an application running on your container to your local host machine
4. How you can reachout to the WWW.

### Sending an HTTP request to an external API(WWW)

We do not need any special setup to communicate with www api from our docker app.


### Accessing network on our local server

Accessing `127.0.0.1` or `localhost` is easy just use this domain `host.docker.internal` provided by docker. This special domain is recognized by docker and converted to your computer's local ip address. Eg: connecting to mongodb database installed in your local computer.

```node
mongoose.connect('mongodb://host.docker.internal:27017/swfavourites')
```

### Communicating between multiple containers (networks)

```docker
docker network create favourites-net
```

This command create a network which can be used by all our isolated docker instance to talk to each other.

Now that you have already created the network with the above command. You need to run the docker app with a network flag poting to the created network.

```bash
docker run --network my_network_name
```

eg:

```docker
docker run -d --name mongodb --network favourites-net mongo
```

* `docker network ls` to view the list of all available networks

**NOTE** Now as all the docker containers are running on the same network you can connect one container from the other by simply using the container's name as the host name eg:

```node
mongoose.connect('mongodb://mongodb:27017/swfavourites')
```

Here we are using `mongodb` as the host name because we used the `--name mongodb` to start the container.

#### IP Resolving

The ip replacement that is done `host.docker.internal` and cross container ip replacement with `containername` only happens when you are send a request.

### Docker App (Frontend/Backend/MongoDB)

__Step 1 (Localize Mongodb DB Container)__ Install Mongo DB and run it on detach mode and bind port 27017 to 27017 local port  
`docker run --name mongodb -d -p 27017:27017 mongo` or `docker run --name mongodb --rm -d -p 27017:27017 mongo`  
`docker log mongodb` to view the logs produced by the mongodb.

__Step 2 (Dockerize Nodejs App)__ We are dockerizing the nodejs backend with docker.

```Dockerfile
FROM node

WORKDIR /app

COPY package.json .

RUN npm install

COPY . .

EXPOSE 8080

CMD ["node", "app.js"]
```

  1) Create Image from the docker file `docker build -t goals-node .`
  2) Spinup the image `docker run --name goals-backend --rm -p 8080:8080 goals-node`
