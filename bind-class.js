try{ var base = window; }catch( error ){ var base = exports; }
( function module( base ){
	var bindClass = function bindClass( ){
		var parameters = Array.prototype.slice.call( arguments );
		var childSet;
		var parentSet;
		var childClass;
		var parentClass;
		var parentList;
		/*
			NOTE: If you're itching to optimize this, please don't.
				This follows a flow and we have to follow the rule here.

				1. If the parameters length is 2 then the parameter may consist
					of class set or just the class itself.

					a. We have to check if there is a child class set, parent class set,
						just the child class or just the parent class.
					b. If we have a class set, check if every class is a verified class.

				2. If the parameters length is greater than 2 then the parameter
					may consist of a child class set or a child class and
					a parent ancestry list.

					a. If it is a child class set check if every class is a verified class.
					b. Extract the parent classes as ancestry list and check if all
						of them are verified classes.
		*/
		if( parameters.length == 2 ){
			if( parameters[ 0 ] instanceof Array ){
				childSet = parameters[ 0 ];
				for( var index = 0; index < childSet.length; index++ ){
					if( typeof childSet[ index ] != "function" ){
						throw new Error( "invalid class function" );
					}
				}
			}else if( typeof parameters[ 0 ] == "function" ){
				childClass = parameters[ 0 ];
				if( !childClass.name ){
					throw new Error( "invalid class namespace" );
				}
			}
			if( parameters[ 1 ] instanceof Array ){
				parentSet = parameters[ 1 ];
				for( var index = 0; index < parentSet.length; index++ ){
					if( typeof parentSet[ index ] != "function" ){
						throw new Error( "invalid class function" );
					}
				}
			}else if( typeof parameters[ 1 ] == "function" ){
				parentClass = parameters[ 1 ];
				if( !parentClass.name ){
					throw new Error( "invalid class namespace" );
				}
			}
		}else if( parameters.length > 2 ){
			if( parameters[ 0 ] instanceof Array ){
				childSet = parameters[ 0 ];
				for( var index = 0; index < childSet.length; index++ ){
					if( typeof childSet[ index ] != "function" ){
						throw new Error( "invalid class function" );
					}
				}
			}else if( typeof parameters[ 0 ] == "function" ){
				childClass = parameters[ 0 ];
				if( !childClass.name ){
					throw new Error( "invalid class namespace" );
				}
			}
			parentList = parameters.slice( 1 );
			for( var index = 0; index < parentList.length; index++ ){
				if( typeof parentList[ index ] != "function" ){
					throw new Error( "invalid class function" );
				}
			}
		}

		//Copy child class' prototype to a temporary variable.
		var childClassPrototype = { };
		for( var property in childClass.prototype ){
			childClassPrototype[ property ] = childClass.prototype[ property ];
		}

		var pseudoClass = function pseudoClass( ){
			var parameters = Array.prototype.slice.call( arguments );
			templateClass.prototype.parent.apply( this, parameters );
			childClass.apply( this, parameters );
		};
		eval( "pseudoClass = " + pseudoClass.toString( ).replace( "pseudoClass", childClass.name ) + ";" );
		var templateClass = pseudoClass;

		pseudoClass = function pseudoClass( ){ };
		pseudoClass.prototype = parentClass.prototype;
		templateClass.prototype = new pseudoClass( );
		templateClass.prototype.constructor = childClass;

		for( var property in childClassPrototype ){
			templateClass.prototype[ property ] = childClassPrototype[ property ];
		}

		//Create a parent method.
		Object.defineProperty( templateClass.prototype, "parent",
			{
				"enumerable": false,
				"configurable": true,
				"get": function get( ){
					var parent = function parent( ){
						var parameters = Array.prototype.slice.call( arguments );
						parentClass.apply( this, parameters );
					};
					return parent;
				}
			} );


		/*if( "child" in parentClass.prototype ){

		}
		//Create a child method.
		Object.defineProperty( childClass.prototype, "parent",
			{
				"enumerable": true,
				"configurable": true,
				"get": function get( ){
					var parent = function parent( ){
						var parameters = Array.prototype.slice.call( arguments );
						parentClass.apply( this, parameters );
					};
					return parent;
				}
			} );*/

		return templateClass;
	};

	base.bindClass = bindClass;
} )( base );


var ClassA = function ClassA( ){
	console.log( "object A created" );
};

ClassA.prototype.getA = function getA( ){
	return "A";
};

var ClassB = function ClassB( ){
	console.log( "object B created" );
};

ClassB.prototype.getB = function getB( ){
	return "B";
};

ClassB = bindClass( ClassB, ClassA );