
export default class InterpolationMode extends Enum {}

InterpolationMode.linear = new InterpolationMode('linear'); //piecewise linear segments, as in a polyline.
InterpolationMode.linearClosed = new InterpolationMode('linear-closed'); //close the linear segments to form a polygon.

InterpolationMode.step = new InterpolationMode('step'); //alternate between horizontal and vertical segments, as in a step function
InterpolationMode.stepBefore = new InterpolationMode('step-before'); //alternate between vertical and horizontal segments, as in a step function.
InterpolationMode.stepAfter = new InterpolationMode('step-after'); //alternate between horizontal and vertical segments, as in a step function
InterpolationMode.basis = new InterpolationMode('basis'); //a B-spline, with control point duplication on the ends.
InterpolationMode.basisOpen = new InterpolationMode('basis-open'); //an open B-spline; may not intersect the start or end.
InterpolationMode.basisClosed = new InterpolationMode('basis-closed'); //a closed B-spline, as in a loop.
InterpolationMode.bundle = new InterpolationMode('bundle'); //equivalent to basis, except the tension parameter is used to straighten the spline.
InterpolationMode.cardinal = new InterpolationMode('cardinal'); //a Cardinal spline, with control point duplication on the ends.
InterpolationMode.cardinalOpen = new InterpolationMode('cardinal-open'); //an open Cardinal spline; may not intersect the start or end, but will intersect other control points.
InterpolationMode.cardinalClosed = new InterpolationMode('cardinal-closed'); //a closed Cardinal spline, as in a loop.
InterpolationMode.monotone = new InterpolationMode('monotone'); //cubic interpolation that preserves monotonicity in y.
