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

## NODE JS Example.

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


### Node Image.
1) `docker run node`
3) `docker run -it nnode`.


## Node JS Example 2

```Dockerfile

FROM node

WORKDIR /app

COPY package.json /app 

RUN npm install 

COPY . /app 

EXPOSE 80

# RUN node server.js # Incorrect because we only want to start a server if we start a container based on the image. Also if we start multile containers based on the same image we also start multiple node service there 

CMD ["node", "server.js"]

```

**COPY . /app** 

Here the `COPY . /app` means copy the first path is outside of the image where the file lives and that should be copied into the image. this is basically the project's root folder containing the Dockerfile excluding the Dockerfile. All the folder / sub folder and files in the ./ directory should be copied into the image i.e /app directory which is inside the image. every container has it's own internal filesystem which is totally detached from your file system and is hidden away inside the docker container. The /app folder will be created if it does not exists.

**WORKDIR /app**

All the commands should be executed in the /app folder inside the container.

Now hit `-t hello-docker .` to create an image based on the instruction mentioned on the `Dockerfile` in the `.` directory.

Finally `docker run -p 3000:80 hello-docker`. Here -p is published and 3000 is the local port under which you want to access this application and 80 is the docker container expose port

Close the container `docker stop hello-docker`. `docker ps` to find the container name. `docker start container-name` to restart the stopped container because there is no need of creating contaner everytime.

`docker run -p 3000:80 -d hello-docker` to start the container in detach mode. `docker attach hello-docker` to attach the detached container. `docker log -f container-name` to see the log of a detached container.


