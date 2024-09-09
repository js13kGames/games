<?xml version="1.0"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
<xsl:variable name="base" select="document('base.xml')"/>
<xsl:template match="/">
	<xsl:variable name="geese" select="g"/>
	<xsl:variable name="foxinitial" select="$base/main/fox"/>
	<xsl:variable name="goal" select="$base/main/goal"/>
	<html>
	<head>
	<style>
	input {
		display: none;
	}
	
	input[type=reset] {
		display: block;
		position: absolute;
		right: 10px;
		top: 10px;
		border: 1px solid black;
		border-radius: 2px;
		padding: 2px 4px;
		font-size: 1rem;
		background: #DDD;
		cursor: pointer;
		text-shadow: unset;
		z-index: 1000000000;
	}
	
	@keyframes turn {
		from {z-index: 1;}
		to {z-index: 600;}
	}
	@keyframes sixty {
		from {top: 0rem;}
		to {top: calc(-58 * var(--ww) * 1.5);}
	}
	html {
		overflow: hidden;
	}
	body {
		--w: 400;
		--ww: 1.5rem;
		font-family: Verdana, sans-serif;
	}
	@media screen and (min-width: 500px) and (min-height: 500px){
		body  {--w: 500; --ww: 1.5rem;}
	}
	@media screen and (min-width: 600px) and (min-height: 600px){
		body  {--w: 600; --ww: 2rem;}
	}
	@media screen and (min-width: 750px) and (min-height: 750px){
		body  {--w: 750; --ww: 2.5rem;}
	}
	@media screen and (min-width: 900px) and (min-height: 900px){
		body  {--w: 900; --ww: 3rem;}
	}
	@media screen and (min-width: 1200px) and (min-height: 1200px){
		body  {--w: 1200; --ww: 4rem;}
	}
	@media screen and (min-width: 1500px) and (min-height: 1500px){
		body  {--w: 1500; --ww: 5rem;}
	}
	@media screen and (min-width: 1800px) and (min-height: 1800px){
		body  {--w: 1800; --ww: 6rem;}
	}
	.game {
		position: absolute;
		width: calc(var(--w) * 1px);
		height: calc(var(--w) * 1px);
		top: 0px;
		left: 0px;
		
	}
	.gt, .ft {
		display: block;
		animation-name: turn;
  		animation-duration: 60s;
		animation-timing-function: linear;
		z-index: 600;
	}
	label {
		font-size: calc(var(--ww) * 0.45);
		text-align: center;
		padding-top: 2px;
		text-shadow: 1px 1px 1px black, -1px -1px 1px black, -1px 1px 1px black, 1px -1px 1px black;

	}
	#clock {
		position: absolute;
		left: 10px;
		top: 10px;
		display: block;
		overflow: hidden;
		width: calc(var(--ww) * 3.5);
		height: calc(var(--ww) * 1.5 + 2px);
		font-size: calc(var(--ww) * 0.5);
		background: white;
		border: 1px solid black;
	}
	#clock > div {
		position: absolute;
		left: 0px;
		top: 0px;
		animation-name: sixty;
		animation-duration: 60s;
		animation-timing-function: steps(59,jump-none);
	}
	#clock > div > div {
		width: calc(var(--ww) * 3.5);
		display: inline-block;
		height: calc(var(--ww) * 1.5);
		text-align: center;
		line-height: calc(var(--ww) * 1.5);
	}
		.node {
			width: calc(var(--ww) * 0.625);
			height: calc(var(--ww) * 0.625);
			border: 1px solid black;
			cursor: pointer;
			position: absolute;
			display: block;
			background: #CCC;
			user-select: none;
		}
		 
		.node-<xsl:value-of select="$goal"/> {
			border: 2px solid red;
			outline: 2px solid white;
		}
		.node.block {
			z-index: 1000000000;
			background: transparent;
			cursor: default;
			width: calc(var(--ww) * 1.5);
			height: calc(var(--ww) * 1.5);
			border: none;
			outline: none;
		}
		.blank {
			z-index: 1;
		}
		.goose, .goosea, .goose-dead, .fox, .fox-a {
			z-index: 0;
		}
		.goose-dead {
			display: none;
		}
		.goose-dead, .fox-m, .fox-j {
			opacity: 0;
		}
		.ft .goosea, .fox, .fox-a, .blank {
			cursor: default;
		}
		#startLabel, .fox-loses, .fox-wins {
			position: absolute;
			display: block;
			left: 10px;
			top: 10px;
			width: calc(var(--ww) * 3.5);
			height: calc(var(--ww) * 1.5);
			line-height: calc(var(--ww) * 1.5);
			opacity: 1;
			text-shadow: unset;
		}
		#startLabel {
			z-index: 10000000;
			background: #DDF;
			cursor: pointer;
		}
		#start:checked + #startLabel {
			display: none;
		}
		.fi:active ~ .ft, .gi:active ~ .gt, .fi:active ~ .gt #clock > div {
			z-index: 800;
			animation-name: none;
		}
		.fox-loses, .fox-wins {
			z-index: 1;
			background: #AFA;
			cursor: default;
			border: 1px solid black;
			overflow: hidden;
		}
		.fox-loses {
			line-height: max(1rem,calc(var(--ww) * 1.5 - 2rem));
		}
		.fox-wins {
			background: #FAA;
		}
	.ft {
		<xsl:for-each select="$base/main/node">--g<xsl:value-of select="position()"/>: 0;
		</xsl:for-each>
	}
	.gt {
		<xsl:for-each select="$base/main/node">--g<xsl:value-of select="position()"/>: 0;
		</xsl:for-each>
		--ng: calc(-1<xsl:for-each select="$base/main/node"> + var(--g<xsl:value-of select="position()"/>)</xsl:for-each>);
	}
	.gt #clock {
		z-index: var(--ng);
	}
	#fox-<xsl:value-of select="$goal"/>:checked ~ .gt #clock {
		z-index: 0;
	}
		<xsl:for-each select="$base/main/node">
			.node-<xsl:value-of select="position()" /> {
				top: calc((<xsl:value-of select="y" /> * 1px - 36px ) * var(--w) / 600 - 1rem);
				left: calc((<xsl:value-of select="x" /> * 1px + 4px) * var(--w) / 600 - 1rem);
			}
			#fox-<xsl:value-of select="position()" />:checked ~ div .fox.node-<xsl:value-of select="position()" /> {
				z-index: 500;
			}
			.fox-m<xsl:value-of select="position()" />:checked ~ div .fox.node-<xsl:value-of select="position()" /> {
				z-index: 500;
				background: #FCA;
			}
			.fox-a<xsl:value-of select="position()" />:checked ~ div .fox.node-<xsl:value-of select="position()" /> {
				z-index: 500;
				background: #ACF;
			}
		</xsl:for-each>
		<xsl:for-each select="$base/main/node">
			<xsl:variable name="pid" select="position()"/>
			
			.fox-j.c-<xsl:value-of select="$pid" /> {
				--nj: calc(0<xsl:for-each select="$base/main/node"><xsl:variable name="a" select="position()"/><xsl:for-each select="jump"><xsl:if test="$a=$pid"> + <xsl:if test="c=$goal">3 * </xsl:if>var(--j<xsl:value-of select="b"/>-<xsl:value-of select="c"/>)</xsl:if></xsl:for-each></xsl:for-each>);
			}
			.fox-m.to-<xsl:value-of select="$pid" /> {
				--nj: calc(0<xsl:for-each select="$base/main/node"><xsl:variable name="a" select="position()"/><xsl:for-each select="jump"><xsl:if test="$a=$pid"> + <xsl:if test="c=$goal">3 * </xsl:if>var(--j<xsl:value-of select="b"/>-<xsl:value-of select="c"/>)</xsl:if></xsl:for-each></xsl:for-each>);
				--nm: calc(1<xsl:for-each select="$base/main/node"><xsl:if test="position()=$pid"><xsl:for-each select="neighbor"><xsl:if test=".!=$pid"> + <xsl:if test=".=$goal">7 * </xsl:if>(1 - var(--g<xsl:value-of select="."/>))</xsl:if></xsl:for-each></xsl:if></xsl:for-each>);
				--dg: calc(0<xsl:for-each select="d"> + var(--g<xsl:value-of select="position()"/>) * <xsl:value-of select="."/></xsl:for-each>);
			}
			#fox-<xsl:value-of select="$pid" />:checked ~ div .fox-m.node-<xsl:value-of select="$pid" /> {
				z-index: 40;
				background: #DDF;
				left: 10px;
				top: 10px;
				cursor: pointer;
				width: calc(var(--ww) * 3.5);
				height: calc(var(--ww) * 1.5);
				line-height: calc(var(--ww) * 1.5);
				opacity: 1;
				text-shadow: unset;
			}
			<xsl:for-each select="neighbor">
				<xsl:variable name="nid" select="."/>
				#fox-m<xsl:value-of select="$pid" />-<xsl:value-of select="." />:checked ~ div .fox.node-<xsl:value-of select="." /> {
					z-index: 40;
					background: #DDF;
					left: 10px;
					top: 10px;
					cursor: pointer;
					width: calc(var(--ww) * 3.5);
					height: calc(var(--ww) * 1.5);
					line-height: calc(var(--ww) * 1.5);
					opacity: 1;
					text-shadow: unset;
				}
				#fox-m<xsl:value-of select="$pid" />-<xsl:value-of select="." />:checked ~ div .fox.node-<xsl:value-of select="." />::after {
					content: " Done";
				}
				#fox-<xsl:value-of select="$pid" />:checked ~ .gooseInput-<xsl:value-of select="." />:checked ~ div .fox-m.to-<xsl:value-of select="." /> {
					display: none;
				}
				<xsl:if test="$nid!=$goal">
				#fox-<xsl:value-of select="$pid" />:checked ~ div .fox-m.to-<xsl:value-of select="$nid" /> {
					<xsl:for-each select="$base/main/node"><xsl:variable name="a" select="position()"/><xsl:for-each select="jump"><xsl:if test="$a=$nid"><xsl:if test="(b!=$pid) and (c!=$pid)">--j<xsl:value-of select="b"/>-<xsl:value-of select="c"/>: calc(var(--g<xsl:value-of select="b"/>) * (1 - var(--g<xsl:value-of select="c"/>)));</xsl:if><xsl:if test="b=$pid">--j<xsl:value-of select="b"/>-<xsl:value-of select="c"/>: 0;</xsl:if><xsl:if test="c=$pid">--j<xsl:value-of select="b"/>-<xsl:value-of select="c"/>: calc(var(--g<xsl:value-of select="b"/>) * 1);</xsl:if>
					</xsl:if></xsl:for-each></xsl:for-each>
					z-index: calc(100000 + var(--nj) * 10000 + var(--nm) * 1000 - var(--dg));
				}
				</xsl:if>
				<xsl:if test="$nid=$goal">
				#fox-<xsl:value-of select="$pid" />:checked ~ div .fox-m.to-<xsl:value-of select="$nid" /> {
					z-index: 1100000;
				}
				</xsl:if>
			</xsl:for-each>
			<xsl:for-each select="jump">
				<xsl:variable name="c" select="c"/>
				<xsl:variable name="b" select="b"/>
				#fox-<xsl:value-of select="$pid" />:checked ~ .gooseInput-<xsl:value-of select="b" />:checked ~ div .fox-j.node-<xsl:value-of select="$pid" />.c-<xsl:value-of select="c" />, #fox-j<xsl:value-of select="$pid" />-<xsl:value-of select="c" />:checked ~ div .fox.node-<xsl:value-of select="c" />, #fox-j<xsl:value-of select="$pid" />-<xsl:value-of select="c" />:checked ~ div .goose-dead.node-<xsl:value-of select="b" /> {
					z-index: 40;
					background: #DDF;
					left: 10px;
					top: 10px;
					cursor: pointer;
					width: calc(var(--ww) * 3.5);
					height: calc(var(--ww) * 1.5);
					line-height: calc(var(--ww) * 1.5);
					opacity: 1;
					text-shadow: unset;
				}
				#fox-<xsl:value-of select="$pid" />:checked ~ .gooseInput-<xsl:value-of select="c" />:checked ~ div .fox-j.c-<xsl:value-of select="c" /> {
					display: none;
				}
				#fox-j<xsl:value-of select="$pid" />-<xsl:value-of select="c" />:checked ~ div .fox.node-<xsl:value-of select="c" />::after {
					content: " Done";
				}
				<xsl:if test="$c!=$goal">
				#fox-<xsl:value-of select="$pid" />:checked ~ .gooseInput-<xsl:value-of select="b" />:checked ~ div .fox-j.node-<xsl:value-of select="$pid" />.c-<xsl:value-of select="c" /> {
					<xsl:for-each select="$base/main/node"><xsl:variable name="a" select="position()"/><xsl:for-each select="jump"><xsl:if test="$a=$c"><xsl:if test="b!=$b">--j<xsl:value-of select="b"/>-<xsl:value-of select="c"/>: calc(var(--g<xsl:value-of select="b"/>) * (1 - var(--g<xsl:value-of select="c"/>)));</xsl:if><xsl:if test="b=$b">--j<xsl:value-of select="b"/>-<xsl:value-of select="c"/>: 0;</xsl:if>
					</xsl:if></xsl:for-each></xsl:for-each>
					z-index: calc(1000000 + var(--nj) * 10);
				}
				</xsl:if>
				<xsl:if test="$c=$goal">
				#fox-<xsl:value-of select="$pid" />:checked ~ .gooseInput-<xsl:value-of select="b" />:checked ~ div .fox-j.node-<xsl:value-of select="$pid" />.c-<xsl:value-of select="c" /> {
					
					z-index: 1100000;
				}
				</xsl:if>
				#fox-j<xsl:value-of select="$pid" />-<xsl:value-of select="c" />:checked ~ div .fox.node-<xsl:value-of select="c" /> {
					z-index: 40;
				}
				#fox-j<xsl:value-of select="$pid" />-<xsl:value-of select="c" />:checked ~ div .goose-dead.node-<xsl:value-of select="b" /> {
					z-index: 45;
				}
				
			</xsl:for-each>
		</xsl:for-each>
		
		
		<xsl:for-each select="$base/main/node">
			.gooseInput-<xsl:value-of select="position()" />:checked ~ div.ft {
				--g<xsl:value-of select="position()" />: 1;
			}
			.gooseInput-<xsl:value-of select="position()" />:checked ~ div.gt, .gc-<xsl:value-of select="position()" />:checked ~ div.gt {
				--g<xsl:value-of select="position()" />: 1;
			}
			<xsl:variable name="gid" select="position()"/>
			<xsl:variable name="gci" select="g"/>
			<xsl:if test="contains($geese,$gci)">
			<xsl:for-each select="$base/main/node">
				<xsl:variable name="pid" select="position()"/>
				#goose-<xsl:value-of select="$gid" />-<xsl:value-of select="position()" />:checked ~ div .goosea-<xsl:value-of select="$gid" />.node-<xsl:value-of select="position()" /> {
					z-index: 50;
				}
				
				#goose-<xsl:value-of select="$gid" />-<xsl:value-of select="position()" />:checked ~ div .goose-<xsl:value-of select="$gid" />-dead.node-<xsl:value-of select="position()" /> {
					display: block;
				}
				<xsl:for-each select="neighbor">
				#goose-<xsl:value-of select="$gid" />-a<xsl:value-of select="$pid" />:checked ~ div .goose-<xsl:value-of select="$gid" />.node-<xsl:value-of select="." /> {
					z-index: 30;
					background: #FBB;
				}
				#goose-<xsl:value-of select="$gid" />-a<xsl:value-of select="$pid" />:checked ~ div .goose-<xsl:value-of select="$gid" />.node-<xsl:value-of select="." /> * {
					opacity: 0;
				}
				</xsl:for-each>
				#goose-<xsl:value-of select="$gid" />-a<xsl:value-of select="$pid" />:checked ~ div .goose-<xsl:value-of select="$gid" />.node-<xsl:value-of select="$pid" /> {
					z-index: 30;
					text-shadow: 1px 1px 1px red, -1px -1px 1px red, -1px 1px 1px red, 1px -1px 1px red;
				}
			</xsl:for-each>
			</xsl:if>
		</xsl:for-each>
		
	</style>
	</head>
		<body>
		<form action="/">
			<input type="radio" name="start" class="fi" id="start" />
			<label for="start" id="startLabel">Start</label>
			<input type="reset" value="Restart"/>
			

			<xsl:for-each select="$base/main/node">
				<xsl:variable name="pid" select="position()"/>
				<input type="radio" name="fox" class="fi">
				<xsl:attribute name="id">fox-<xsl:value-of select="position()" /></xsl:attribute>
				<xsl:if test="$pid=$foxinitial"><xsl:attribute name="checked"></xsl:attribute></xsl:if>
				</input>
				<xsl:for-each select="neighbor">
					<input type="radio" name="fox">
					<xsl:attribute name="id">fox-m<xsl:value-of select="$pid" />-<xsl:value-of select="." /></xsl:attribute>
					<xsl:attribute name="class">fox-m<xsl:value-of select="$pid" /></xsl:attribute>
					</input>
				</xsl:for-each>
				<xsl:for-each select="jump">
					<input type="radio" name="fox">
					<xsl:attribute name="id">fox-j<xsl:value-of select="$pid" />-<xsl:value-of select="c" /></xsl:attribute>
					<xsl:attribute name="class">fox-a<xsl:value-of select="$pid" /> fox-b<xsl:value-of select="b" /> fox-c<xsl:value-of select="c"/></xsl:attribute>
					</input>
				</xsl:for-each>
			</xsl:for-each>
			
			<xsl:for-each select="$base/main/node">
				<xsl:variable name="gid" select="position()"/>
				<xsl:variable name="gci" select="g"/>
				<xsl:if test="contains($geese,$gci)">
				<xsl:for-each select="$base/main/node">
					<input type="radio">
					<xsl:attribute name="name">goose-<xsl:value-of select="$gid"/></xsl:attribute>
					<xsl:attribute name="id">goose-<xsl:value-of select="$gid"/>-<xsl:value-of select="position()" /></xsl:attribute>
					<xsl:attribute name="class">gi gooseInput-<xsl:value-of select="position()" /></xsl:attribute>
					<xsl:if test="position()=$gid"><xsl:attribute name="checked"></xsl:attribute></xsl:if>
					</input>
					<input type="radio">
					<xsl:attribute name="name">goose-<xsl:value-of select="$gid"/></xsl:attribute>
					<xsl:attribute name="id">goose-<xsl:value-of select="$gid"/>-a<xsl:value-of select="position()" /></xsl:attribute>
					<xsl:attribute name="class">gc-<xsl:value-of select="position()" /></xsl:attribute>
					</input>
				</xsl:for-each>
				<input type="radio">
					<xsl:attribute name="name">goose-<xsl:value-of select="$gid"/></xsl:attribute>
					<xsl:attribute name="id">goose-<xsl:value-of select="$gid"/>-dead</xsl:attribute>
				</input>
				</xsl:if>
			</xsl:for-each>

			<div class="game gt">
			<label class="fox-wins">
				You lost.
			</label>
			<div id="clock">
				<div>
					<xsl:for-each select="$base/main/sixty">
					<div><xsl:value-of select="." /></div>
					</xsl:for-each>
				</div>
			</div>
			
			<xsl:for-each select="$base/main/node">
				<xsl:variable name="pid" select="position()"/>
				<label>
				<xsl:attribute name="for">fox-<xsl:value-of select="$pid" /></xsl:attribute>
				<xsl:attribute name="class">node fox node-<xsl:value-of select="$pid" /></xsl:attribute>
				🦊
				</label>
			</xsl:for-each>
			<xsl:for-each select="$base/main/node">
				<xsl:variable name="gid" select="position()"/>
				<xsl:variable name="gci" select="g"/>
				<xsl:if test="contains($geese,$gci)">
				<xsl:for-each select="$base/main/node">
					<label>
					<xsl:attribute name="for">goose-<xsl:value-of select="$gid"/>-<xsl:value-of select="position()" /></xsl:attribute>
					<xsl:attribute name="class">node goose goose-<xsl:value-of select="$gid"/> node-<xsl:value-of select="position()" /></xsl:attribute>
					<span>🪿</span>
					</label>
					<label>
					<xsl:attribute name="for">goose-<xsl:value-of select="$gid"/>-a<xsl:value-of select="position()" /></xsl:attribute>
					<xsl:attribute name="class">node goosea goosea-<xsl:value-of select="$gid"/> node-<xsl:value-of select="position()" /></xsl:attribute>
					🪿
					</label>
				</xsl:for-each>
				</xsl:if>
				<label>
				<xsl:attribute name="class">node blank node-<xsl:value-of select="position()" /></xsl:attribute>
				</label>
			</xsl:for-each>
			</div>
			<div class="game ft">
			<label class="fox-loses">
				You won!!
				<br />
				<span style="font-size: 0.8rem; line-height: 1rem;">
				<a href="#w">Click to record your win</a>, then go home for a new level.
				</span>
			</label>
			<xsl:for-each select="$base/main/node">
				<xsl:variable name="pid" select="position()"/>
				<label>
				<xsl:attribute name="for">fox-<xsl:value-of select="$pid" /></xsl:attribute>
				<xsl:attribute name="class">node fox node-<xsl:value-of select="$pid" /></xsl:attribute>
				🦊
				</label>
				<xsl:for-each select="neighbor">
					<label>
					<xsl:attribute name="for">fox-m<xsl:value-of select="$pid" />-<xsl:value-of select="." /></xsl:attribute>
					<xsl:attribute name="class">node fox-m node-<xsl:value-of select="$pid" /> to-<xsl:value-of select="." /></xsl:attribute>
					🦊 Move
					</label>
				</xsl:for-each>
				<xsl:for-each select="jump">
					<label>
					<xsl:attribute name="for">fox-j<xsl:value-of select="$pid" />-<xsl:value-of select="c" /></xsl:attribute>
					<xsl:attribute name="class">node fox-j node-<xsl:value-of select="$pid" /> b-<xsl:value-of select="b" /> c-<xsl:value-of select="c" /></xsl:attribute>
					🦊 Jump
					</label>
				</xsl:for-each>
			</xsl:for-each>
			
			<xsl:for-each select="$base/main/node">
				<xsl:variable name="gid" select="position()"/>
				<xsl:variable name="gci" select="g"/>
				<xsl:if test="contains($geese,$gci)">
				<xsl:for-each select="$base/main/node">
					<label>
					<xsl:attribute name="for">goose-<xsl:value-of select="$gid"/>-<xsl:value-of select="position()" /></xsl:attribute>
					<xsl:attribute name="class">node goose goose-<xsl:value-of select="$gid"/> node-<xsl:value-of select="position()" /></xsl:attribute>
					<span>🪿</span>
					</label>
					<label>
					
					<xsl:attribute name="class">node goosea goosea-<xsl:value-of select="$gid"/> node-<xsl:value-of select="position()" /></xsl:attribute>
					🪿
					</label>
					<label>
					<xsl:attribute name="for">goose-<xsl:value-of select="$gid"/>-dead</xsl:attribute>
					<xsl:attribute name="class">node goose-dead goose-<xsl:value-of select="$gid"/>-dead node-<xsl:value-of select="position()" /></xsl:attribute>
					Kill 🪿
					</label>
				</xsl:for-each>
				</xsl:if>
				<label>
				<xsl:attribute name="class">node blank node-<xsl:value-of select="position()" /></xsl:attribute>
				</label>
				<label>
				<xsl:attribute name="class">node block node-<xsl:value-of select="position()" /></xsl:attribute>
				</label>
			</xsl:for-each>
			</div>
		</form>
		</body>
	</html>
</xsl:template>
</xsl:stylesheet>