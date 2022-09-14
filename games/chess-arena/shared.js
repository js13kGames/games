"use strict";

const PAWN = 0x01;
const KING = 0x02;
const KNIGHT = 0x04;
const FIRST_MULTIPLE_MOVES_PIECE = 0x08;
const ROOK = 0x08;
const BISHOP = 0x10;
const QUEEN = 0x20;
const WHITE = 0x40;
const NO_MOVE_OR_PROMOTED = 0x80; // if pawn -> check first move or not else check if it is a promoted piece
const ALL = PAWN|KING|KNIGHT|ROOK|BISHOP|QUEEN;

let PIECES = {};
PIECES[PAWN] = 8;
PIECES[KNIGHT] = PIECES[BISHOP] = PIECES[ROOK] = 2;
PIECES[QUEEN] = PIECES[KING] = 1;

let TIMES = {};
TIMES[PAWN] = 2;
TIMES[KNIGHT] = TIMES[BISHOP] = TIMES[ROOK] = 4;
TIMES[QUEEN] = 6;

// Chessboard structure from Oscar Toledo G: https://nanochess.org/chess4.html
//      0  1  2  3  4  5  6  7  8  9
//  00 -- -- -- -- -- -- -- -- -- --
//  10 -- -- -- -- -- -- -- -- -- --
//  20 -- A8 B8 C8 D8 E8 F8 G8 H8 --
//  30 -- A7 B7 C7 D7 E7 F7 G7 H7 --
//  40 -- A6 B6 C6 D6 E6 F6 G6 H6 --
//  50 -- A5 B5 C5 D5 E5 F5 G5 H5 --
//  60 -- A4 B4 C4 D4 E4 F4 G4 H4 --
//  70 -- A3 B3 C3 D3 E3 F3 G3 H3 --
//  80 -- A2 B2 C2 D2 E2 F2 G2 H2 --
//  90 -- A1 B1 C1 D1 E1 F1 G1 H1 --
// 100 -- -- -- -- -- -- -- -- -- --
// 110 -- -- -- -- -- -- -- -- -- --

let B;
let newB = ()=>{
    B = [    ,  ,  ,  ,  ,  ,  ,  ,  , ,
             ,  ,  ,  ,  ,  ,  ,  ,  , ,
             , 0, 0, 0, 0, 2, 0, 0, 0, ,
             , 0, 0, 0, 0, 0, 0, 0, 0, ,
             , 0, 0, 0, 0, 0, 0, 0, 0, ,
             , 0, 0, 0, 0, 0, 0, 0, 0, ,
             , 0, 0, 0, 0, 0, 0, 0, 0, ,
             , 0, 0, 0, 0, 0, 0, 0, 0, ,
             , 0, 0, 0, 0, 0, 0, 0, 0, ,
             , 0, 0, 0, 0,66, 0, 0, 0, ,
             ,  ,  ,  ,  ,  ,  ,  ,  , ,
             ,  ,  ,  ,  ,  ,  ,  ,  ,   ];
}
newB();

let startB = [    ,  ,  ,  ,  ,  ,  ,  ,  , ,
                    ,  ,  ,  ,  ,  ,  ,  ,  , ,
                    , 8,4,16,32, 2,16, 4, 8, ,
                    , 1, 1, 1, 1, 1, 1, 1, 1, ,
                    ,  ,  ,  ,  ,  ,  ,  ,  , ,
                    ,  ,  ,  ,  ,  ,  ,  ,  , ,
                    ,  ,  ,  ,  ,  ,  ,  ,  , ,
                    ,  ,  ,  ,  ,  ,  ,  ,  , ,
                    ,65,65,65,65,65,65,65,65, ,
                    ,72,68,80,96,66,80,68,72, ,
                    ,  ,  ,  ,  ,  ,  ,  ,  , ,
                    ,  ,  ,  ,  ,  ,  ,  ,  ,   ];


// Moves are defined relative to the piece in oscar toledo's chessboard
// for example:
//
//       0    1   2   3   4   5   6   7   8    9
//  00 ----- --- --- --- --- --- --- --- --- -----
//  10 ----- --- --- --- --- --- --- --- --- -----
//  20 ----- --- --- --- --- --- --- --- --- -----
//  30 (-24) -23 -22 -21 -20 -19 -18 -17 -16 (-15)
//  40 (-14) -13 -12 -11 -10  -9  -8  -7  -6  (-5)
//  50  (-4)  -3  -2  -1 [X]   1   2   3   4   (5)
//  60   (6)   7   8   9  10  11  12  13  14  (15)
//  70  (16)  17  18  19  20  21  22  23  24  (25)
//  80 ----- --- --- --- --- --- --- --- --- -----
//  90 ----- --- --- --- --- --- --- --- --- -----
// 100 ----- --- --- --- --- --- --- --- --- -----
// 110 ----- --- --- --- --- --- --- --- --- -----


const M = {};
M[PAWN|NO_MOVE_OR_PROMOTED] = [9,10,11,20];
M[PAWN|NO_MOVE_OR_PROMOTED|WHITE] = [-20,-11,-10,-9];
M[PAWN] = [9,10,11];
M[PAWN|WHITE] = [-11,-10,-9];
// M[KING] = [-11,-10,-9,-1,1,9,10,11]; // no need for king moves
M[KNIGHT] = [-21,-19,-12,-8,8,12,19,21];
M[ROOK] = [-10,-1,1,10];
M[BISHOP] = [-11,-9,9,11];
M[QUEEN] = [-11,-10,-9,-1,1,9,10,11]

let getM = (p,P,m,c,C,r,i)=>{
    p = parseInt(p); // piece's cell number
    P = B[p]; // piece type
    if(P===0 || P&KING) return [];
    r=[]; // result

    m = M[P] ||M[P&~NO_MOVE_OR_PROMOTED] || M[P&ALL]; // moves directions
    for(i=0;i<m.length;i++) {
        c = p+m[i]; // cell number
        C = B[c]; // cell value

        // TODO en passant(?)
        while(C||(C===0 && ( !(P&PAWN) || ![-11,-9,9,11].includes(m[i]) ) ) ) {
            if( C==0 // empty
                || C&WHITE ^ P&WHITE // opponent on cell
                ) {
                    r.push(c);
                    if(C!=0) break;
            } else break; // ally on cell

            // case fin
            if((P&ALL)<FIRST_MULTIPLE_MOVES_PIECE) break;
            c +=m[i];
            C = B[c];
        }
    }
    return r;
}

let setM = (i1,i2,p1,p2)=>{
    p1 = B[i1];
    p2 = B[i2];
    B[i2] = (p1&NO_MOVE_OR_PROMOTED)?p1&~NO_MOVE_OR_PROMOTED: p1;
    B[i1] = 0;
    return p2;
}

let getFreeP = (cl,i,l,p)=> {
    let ps = Object.assign({},PIECES);

    for(i=0,l=B.length;i<l+W.length;i++){
        p = i<l? B[i] : W[i-l];

        if(p && (p&WHITE) == cl && !(!(p&PAWN) && p&NO_MOVE_OR_PROMOTED ) ) {
            ps[p&ALL]--;
        }
    }

    return ps;
}

