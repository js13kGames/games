/*
e:empty
s:stone
t:tire
R:up/right
L:up/left
r:down/right
l:down/left
b:border

P:play
S:speed
X:back
O:reset
*/

/*
c:clear
p:position

E:Entry/Exit

M:menu
N:level
D:dimensions
B:back
*/

levels=[
'0242*335es3e',
'0272*665s3es2esese4se2s2es3es2e3ses',
'0110*33leR3eleL',
'0226*5515et2eL6e',
'0141*33reR3eleL',
'0262,5056,0363*55s13es5es3es',
'0263,0556*55sr2elet2e5eleR3e4es'
];


help=[
'e*Choose a level to begin playing. Click on an edge to reverse a column or row and try to get the discs to the matching squares. If you complete all the levels there is a bonus.'+
   'If that is to hard/long run `editor()` in the console.',
's*Run into this and the game ends.',
't*Run into this and you will bounce in the opposite direction',
'R*Allows the disc to change directions. Can be reversed by clicking on it.',
'P*Start game',
'S*Set the game speed',
'X*Go back to menu',
'O*Reset the board'
];