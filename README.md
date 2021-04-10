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

You can also run this image on `play with docker` [Play with Docker](https://labs.play-with-docker.com/p/c1ohogre75e000e2vj9g)
