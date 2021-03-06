// Copyright (c) 2012 Titanium I.T. LLC. All rights reserved. See LICENSE.txt for details.
/*global dump, Raphael, $, wwp:true, Event*/

window.wwp = window.wwp || {};

(function() {
	"use strict";

	var paper = null;
	var start = null;
	var domElement;

	wwp.initializeDrawingArea = function(drawingAreaElement) {
		if (paper !== null) throw new Error("Client.js is not re-entrant");

		domElement = new wwp.DomElement($(drawingAreaElement));
		paper = new Raphael(drawingAreaElement);
		handleDragEvents(drawingAreaElement);
		return paper;
	};

	wwp.drawingAreaHasBeenRemovedFromDom = function() {
		paper = null;
	};

	function handleDragEvents(drawingAreaElement) {
		var drawingArea = $(drawingAreaElement);

		drawingArea.on("selectstart", function(event) {
			// This event handler is needed so IE 8 doesn't select text when you drag outside drawing area
			event.preventDefault();
		});

		domElement.onMouseDown(function(event) {
			event.preventDefault();
			startDrag(event.pageX, event.pageY);
		});

		domElement.onMouseMove(function(event) {
			continueDrag(event.pageX, event.pageY);
		});

		domElement.onMouseLeave(function(event) {
			endDrag();
		});

		domElement.onMouseUp(function(event) {
			endDrag();
		});

		domElement.onTouchStart(function(event) {
			event.preventDefault();
			var originalEvent = event.originalEvent;

			if (originalEvent.touches.length !== 1) {
				start = null;
				return;
			}

			var pageX = originalEvent.touches[0].pageX;
			var pageY = originalEvent.touches[0].pageY;

			startDrag(pageX, pageY);
		});

		domElement.onTouchMove(function(event) {
			var originalEvent = event.originalEvent;

			var pageX = originalEvent.touches[0].pageX;
			var pageY = originalEvent.touches[0].pageY;

			continueDrag(pageX, pageY);
		});

		domElement.onTouchEnd(function(event) {
			endDrag();
		});

		domElement.onTouchCancel(function(event) {
			endDrag();
		});
	}

	function startDrag(pageX, pageY) {
		var offset = domElement.relativeOffset(pageX, pageY);
		start = offset;
	}

	function continueDrag(pageX, pageY) {
		if (start === null) return;

		var end = domElement.relativeOffset(pageX, pageY);
		drawLine(start.x, start.y, end.x, end.y);
		start = end;
	}

	function endDrag() {
		start = null;
	}

	function drawLine(startX, startY, endX, endY) {
		paper.path("M" + startX + "," + startY + "L" + endX + "," + endY);
	}

}());