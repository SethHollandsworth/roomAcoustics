import re
from vpython import *
def readPoints():

    #userInput = input('What file do you want to search? ')
    userInput = "scaledmodel_v5.GEO"
    

    file = open(userInput,'r',encoding='cp1252')
    
    vertices = []
    planes = []
    for line in file:
        if line[0] not in '[;CPA ' and line != '\n':
            vertex = list(map(float,line.split()))
            vertices += [vertex[1:]]
        elif line[0] == '[':
            points = re.findall(r" [0-9]+(?!//)",line)
            stripped = list(map(str.strip, points))
            nums = list(map(int, stripped))
            planes += [nums]
    #print(planes)
    #print(vertices)
    file.close()
    plot(vertices,planes)



def plot(vertices,planes):
    plottedPlanes = []
    for points in planes:
        #if len(points) == 4:
        plottingVerts = [None] * len(points)
        count = 0
        for point in points:
            [a,b,c] = vertices[point - 1]
            plottingVerts[count] = vertex(pos = vec(a,b,c))
            count += 1
        if len(plottingVerts) == 4:
            plottedPlanes.append(quad(vs = plottingVerts))
        #figure out why this isn't plotting right
        else:
            for i in range(0,len(plottingVerts)-2):
                #print(plottingVerts[i])
                plottedPlanes.append(triangle(vs=[plottingVerts[i],plottingVerts[i + 1],plottingVerts[i + 2]]))




readPoints()