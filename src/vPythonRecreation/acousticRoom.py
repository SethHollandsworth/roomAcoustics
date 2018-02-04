from vpython import *
from math import sqrt,sin,pi,cos
from numpy import empty
from pylab import imshow,gray,show
from random import random
import re

# CONSTANTS
NUMBER_PARTICLES = 1000
AXIS_SIZE = 50
ABSORPTION_COEFF = .2
CUBE_SIZE = 100
START_POINT = 50

def initWindow():
    fig = canvas(title = 'Bouncy',width=1500,height=720,userzoom=False)


#initializes all particles
def initParticles():
    allParts = [None] * NUMBER_PARTICLES
    for i in range(0,NUMBER_PARTICLES):
        allParts[i] = sphere(pos = vector(START_POINT,START_POINT,START_POINT))
        initVelocity(allParts[i])

    return allParts


#gets the initial velocity of the particle created
def initVelocity(particle):
    #randomly create a 3-D unit vector
    theta = random() * 2 * pi
    #print(theta)
    k = random() * 2 - 1
    i = sqrt(1 - k**2) * cos(theta)
    j = sqrt(1 - k**2) * sin(theta)
    #scales the unit vector
    #print(i,j,k)
    particle.vel = vector(i,j,k)


#creates the reference axes
def initAxes():
    #x axis
    arrow(axis=vector(AXIS_SIZE,0,0),color=color.red)
    #y axis
    arrow(axis=vector(0,AXIS_SIZE,0),color=color.green)
    #z axis
    arrow(axis=vector(0,0,AXIS_SIZE),color=color.blue)


#simulates absorption by a boundary
def absorb(particle):
    if random() < ABSORPTION_COEFF:
        particle.visible = False;
        del particle

def initCube():
    return box(pos = vec(CUBE_SIZE/2,CUBE_SIZE/2,CUBE_SIZE/2),length = CUBE_SIZE,width = CUBE_SIZE,height = CUBE_SIZE, opacity = .1)


def bounce(particle,cube):
    if particle.pos.x < cube.pos.x - cube.length / 2:
        particle.vel.x *= -1
    elif particle.pos.x > cube.pos.x + cube.length / 2:
        particle.vel.x *= -1
    if particle.pos.y < cube.pos.y - cube.width / 2:
        particle.vel.y *= -1
    elif particle.pos.y > cube.pos.y + cube.width / 2:
        particle.vel.y *= -1
    if particle.pos.z < cube.pos.z - cube.height / 2:
        particle.vel.z *= -1
    elif particle.pos.z > cube.pos.z + cube.height / 2:
        particle.vel.z *= -1

#def iscollide(particle):



# def readPoints():

#     userInput = input('What file do you want to search? ')
#     #userInput = 'churchTestLowCubeNormalizedFlippedYZ.geo'

#     file = open(userInput,'r',encoding='cp1252')
    
#     vertices = []
#     planes = []
#     for line in file:
#         if line[0] not in '[;CPA ' and line != '\n':
#             vertex = list(map(float,line.split()))
#             vertices += [vertex[1:]]
#         elif line[0] == '[':
#             points = re.findall(r" [0-9]+(?!//)",line)
#             stripped = list(map(str.strip, points))
#             nums = list(map(int, stripped))
#             planes += [nums]
#     #print(planes)
#     #print(vertices)
#     file.close()



#a = quad(vs = [vertex(pos = vec(1,1,1)),vertex(pos = vec(1,0,0)),vertex(pos = vec(0,0,0)),vertex(pos = vec(0,1,1))])

def updatePosition(particle):
    particle.pos.x += particle.vel.x
    particle.pos.y += particle.vel.y
    particle.pos.z += particle.vel.z
    #bounce(particle)

def animate():
    while True:
        rate(20)
        for i in particles:
            updatePosition(i)
            bounce(i,cube)



if __name__ == "__main__":
    initWindow()
    initAxes()
    cube = initCube()
    particles = initParticles()
    animate()