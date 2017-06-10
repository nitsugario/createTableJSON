(function($)
{
	$.fn.createTableJSON = function(method)
	{
		var defaults     = {
			type:    'POST',
			dataType: "json",
			url: "",
			data: ""
		};
		var settings     = {};
		var methods      = {
			init: function (options)
			{
				settings = $.extend({}, defaults, options);

				return this.each(function ()
				{
					var $pobContenedor = $(this); 

					if ( settings.url != "" )
					{ 
						methods.setup.apply(this, Array.prototype.slice.call(arguments, 1));
					}
					else
					{
						$.error('El parámetro url es obligatorio. ');
					};
				});
			},
			setup: function ()
			{
				var $pobContenedor  = $(this),
					pobContenedor   = this,
					pobTable        = $("<Table>");

				helpers.mSubmitAjax( $pobContenedor, pobTable );

				return pobContenedor;
			}
		};
		var helpers  = 
		{
			mSubmitAjax: function( $pobContenedor, pobTable )
			{
				$.ajax({
					type:     settings.type,
					dataType: settings.dataType,
					url:      settings.url,
					data:     settings.data,
					success: function( pobRespuestaAjax )
					{
						helpers.mParseTable( pobRespuestaAjax, $pobContenedor, pobTable );
					},
					error: function (jqXHR, exception)
					{
						var msg = '';

						if ( jqXHR.status === 0 )
						msg = 'Sin conexión.\n Verifique la Red';
						else if ( jqXHR.status == 404 )
						msg = 'página solicitada no encontrada. [404]';
						else if ( jqXHR.status == 500 )
						msg = 'Error Interno del Servidor [500].';
						else if ( exception === 'parsererror' )
						msg = 'La Solicitud JSON Fallo error de Parse.';
						else if ( exception === 'timeout' )
						msg = 'Tiempo de espera agotado.';
						else if ( exception === 'abort' )
						msg = 'petición Ajax abortado.';
						else
						msg = 'Error no capturado.\n' + jqXHR.responseText;

						$.error(msg);
					}
				});
			},
			mParseTable: function( pobData, $pobContenedor, pobTable )
			{
				//--Datos de Tabla:
				var lstId         = ( typeof pobData.Table.Id        == 'undefined' ) ? "" : helpers.mValidarDato( pobData.Table.Id,        'st' ),
					lstClass      = ( typeof pobData.Table.Class     == 'undefined' ) ? "" : helpers.mValidarDato( pobData.Table.Class,     'st' ),
					lstStyle      = ( typeof pobData.Table.Style     == 'undefined' ) ? "" : helpers.mValidarDato( pobData.Table.Style,     'st' ),
					lstTabindex   = ( typeof pobData.Table.Tabindex  == 'undefined' ) ? "" : helpers.mValidarDato( pobData.Table.Tabindex,  'st' ),
					lstAccesskey  = ( typeof pobData.Table.Accesskey == 'undefined' ) ? "" : helpers.mValidarDato( pobData.Table.Accesskey, 'st' ),
					lstTitle      = ( typeof pobData.Table.Title     == 'undefined' ) ? "" : helpers.mValidarDato( pobData.Table.Title,     'st' ),
					lobCss        = ( typeof pobData.Table.Css       == 'undefined' ) ? "" : helpers.mValidarDato( pobData.Table.Css,       'ob' ),
					lobCaption    = ( typeof pobData.Table.Caption   == 'undefined' ) ? "" : helpers.mValidarDato( pobData.Table.Caption,   'ob' ),
					lobColgroup   = ( typeof pobData.Table.Colgroup  == 'undefined' ) ? "" : helpers.mValidarDato( pobData.Table.Colgroup,  'ob' ),
					lobRowsFree   = ( typeof pobData.Table.RowsFree  == 'undefined' ) ? "" : helpers.mValidarDato( pobData.Table.RowsFree,  'ob' ),
					lobThead      = ( typeof pobData.Table.Thead     == 'undefined' ) ? "" : helpers.mValidarDato( pobData.Table.Thead,     'ob' ),
					lobTbody      = ( typeof pobData.Table.Tbody     == 'undefined' ) ? "" : helpers.mValidarDato( pobData.Table.Tbody,     'ob' ),
					lobTfoot      = ( typeof pobData.Table.Tfoot     == 'undefined' ) ? "" : helpers.mValidarDato( pobData.Table.Tfoot,     'ob' );


				if( lobCaption != "")
				{
					helpers.mParseCaption( pobTable, lobCaption );
				}

				if( lobColgroup != "")
				{
					helpers.mParseColgroup( pobTable, lobColgroup );
				}

				if( lstId != "")
					pobTable.attr('id',lstId);
				if( lstClass != "")
					pobTable.attr('class',lstClass);
				if( lstTabindex != "")
					pobTable.attr('tabindex',lstTabindex);
				if( lstAccesskey != "")
					pobTable.attr('accesskey',lstAccesskey);
				if( lstTitle != "")
					pobTable.attr('title',lstTitle);
				if( lstStyle != "")
					pobTable.attr('style',lstStyle);

				if( lobThead != "")
					helpers.mParseRows( pobTable, lobThead );
				if( lobTfoot != "")
					helpers.mParseRows( pobTable, lobTfoot );
				if( lobTbody != "")
					helpers.mParseRows( pobTable, lobTbody );
				if( lobRowsFree != "")
					helpers.mParseRows( pobTable, lobRowsFree );

				$pobContenedor.append(pobTable);
			},
			mParseRows: function( pobTable, pobData )
			{
				var lstType          = ( typeof pobData.Type           == 'undefined' ) ? "" : helpers.mValidarDato( pobData.Type,          'st'),
					lstId            = ( typeof pobData.Id             == 'undefined' ) ? "" : helpers.mValidarDato( pobData.Id,            'st'),
					lstClass         = ( typeof pobData.Class          == 'undefined' ) ? "" : helpers.mValidarDato( pobData.Class,         'st'),
					lstStyle         = ( typeof pobData.Style          == 'undefined' ) ? "" : helpers.mValidarDato( pobData.Style,         'st'),
					lstTabindex      = ( typeof pobData.Tabindex       == 'undefined' ) ? "" : helpers.mValidarDato( pobData.Tabindex,      'st'),
					lstAccesskey     = ( typeof pobData.Accesskey      == 'undefined' ) ? "" : helpers.mValidarDato( pobData.Accesskey,     'st'),
					lstTitle         = ( typeof pobData.Title          == 'undefined' ) ? "" : helpers.mValidarDato( pobData.Title,         'st'),
					lobAttributesAdd = ( typeof pobData.AttributesAdd  == 'undefined' ) ? "" : helpers.mValidarDato( pobData.AttributesAdd, 'ob'),
					lobRows          = ( typeof pobData.Rows           == 'undefined' ) ? "" : helpers.mValidarDato( pobData.Rows,          'ob');
				
				if( lstType == "")
					lstType ='RowsFree';

				if ( lstType == 'RowsFree' )
					var lobConten = pobTable;
				else
				{
					var lobConten = $("<"+lstType+">");

					if( lobAttributesAdd != "" )
						helpers.mParseAttributesAddRowConten( lobAttributesAdd, lobConten );

					if( lstId != "")
						lobConten.attr('id',lstId);
					if( lstClass != "")
						lobConten.attr('class',lstClass);
					if( lstTabindex != "")
						lobConten.attr('tabindex',lstTabindex);
					if( lstAccesskey != "")
						lobConten.attr('accesskey',lstAccesskey);
					if( lstTitle != "")
						lobConten.attr('title',lstTitle);
					if( lstStyle != "")
						lobConten.attr('style',lstStyle);
				}

				$.each(lobRows,function( xF,pobDataRow )
				{
					var lobRow = $("<tr>");

					var lstId            = ( typeof pobDataRow.Id            == 'undefined' ) ? "" : helpers.mValidarDato( pobDataRow.Id,            'st'),
						lstClass         = ( typeof pobDataRow.Class         == 'undefined' ) ? "" : helpers.mValidarDato( pobDataRow.Class,         'st'),
						lstStyle         = ( typeof pobDataRow.Style         == 'undefined' ) ? "" : helpers.mValidarDato( pobDataRow.Style,         'st'),
						lstTabindex      = ( typeof pobDataRow.Tabindex      == 'undefined' ) ? "" : helpers.mValidarDato( pobDataRow.Tabindex,      'st'),
						lstAccesskey     = ( typeof pobDataRow.Accesskey     == 'undefined' ) ? "" : helpers.mValidarDato( pobDataRow.Accesskey,     'st'),
						lstTitle         = ( typeof pobDataRow.Title         == 'undefined' ) ? "" : helpers.mValidarDato( pobDataRow.Title,         'st'),
						lobAttributesAdd = ( typeof pobDataRow.AttributesAdd == 'undefined' ) ? "" : helpers.mValidarDato( pobDataRow.AttributesAdd, 'ob'),
						lobEvents        = ( typeof pobDataRow.Event         == 'undefined' ) ? "" : helpers.mValidarDato( pobDataRow.Event,         'ob'),
						lobCells         = ( typeof pobDataRow.Cells         == 'undefined' ) ? "" : helpers.mValidarDato( pobDataRow.Cells,         'ob');

					if( lobAttributesAdd != "" )
						helpers.mParseAttributesAddRow( lobAttributesAdd, lobRow );
					if( lobEvents != "" )
						helpers.mParseEventsRow( lobEvents, lobRow );

					if( lstId != "")
						lobRow.attr('id',lstId);
					if( lstClass != "")
						lobRow.attr('class',lstClass);
					if( lstTabindex != "")
						lobRow.attr('tabindex',lstTabindex);
					if( lstAccesskey != "")
						lobRow.attr('accesskey',lstAccesskey);
					if( lstTitle != "")
						lobRow.attr('title',lstTitle);
					if( lstStyle != "")
						lobRow.attr('style',lstStyle);

					if( lobCells != "")
						helpers.mParseCell( lobRow, lobCells, lstType );

					lobConten.append(lobRow);
				});

				if ( lstType != 'RowsFree' )
				{
					pobTable.append(lobConten);
				}
			},
			mParseCell: function( pobRow, pobDataCells, pstTypeTHBF )
			{
				$.each(pobDataCells,function( xC,pobDataCell ){
					var lstId             = ( typeof pobDataCell.Id            == 'undefined' ) ? "" : helpers.mValidarDato( pobDataCell.Id,            'st'),
						lstClass          = ( typeof pobDataCell.Class         == 'undefined' ) ? "" : helpers.mValidarDato( pobDataCell.Class,         'st'),
						lstStyle          = ( typeof pobDataCell.Style         == 'undefined' ) ? "" : helpers.mValidarDato( pobDataCell.Style,         'st'),
						lstTabindex       = ( typeof pobDataCell.Tabindex      == 'undefined' ) ? "" : helpers.mValidarDato( pobDataCell.tabindex,      'st'),
						lstAccesskey      = ( typeof pobDataCell.Accesskey     == 'undefined' ) ? "" : helpers.mValidarDato( pobDataCell.Accesskey,     'st'),
						lstTitle          = ( typeof pobDataCell.Title         == 'undefined' ) ? "" : helpers.mValidarDato( pobDataCell.Title,         'st'),
						lstDataType       = ( typeof pobDataCell.DataType      == 'undefined' ) ? "" : helpers.mValidarDato( pobDataCell.DataType,      'st'),
						lstType           = ( typeof pobDataCell.Type          == 'undefined' ) ? "" : helpers.mValidarDato( pobDataCell.Type,          'st'),
						lstAbbr           = ( typeof pobDataCell.Abbr          == 'undefined' ) ? "" : helpers.mValidarDato( pobDataCell.Abbr,          'st'),
						lstScope          = ( typeof pobDataCell.Scope         == 'undefined' ) ? "" : helpers.mValidarDato( pobDataCell.Scope,         'st'),
						lstSorted         = ( typeof pobDataCell.Sorted        == 'undefined' ) ? "" : helpers.mValidarDato( pobDataCell.Sorted,        'st'),
						lstColspan        = ( typeof pobDataCell.Colspan       == 'undefined' ) ? "" : helpers.mValidarDato( pobDataCell.Colspan,       'st'),
						lstRowspan        = ( typeof pobDataCell.Rowspan       == 'undefined' ) ? "" : helpers.mValidarDato( pobDataCell.Rowspan,       'st'),
						lstHeaders        = ( typeof pobDataCell.Headers       == 'undefined' ) ? "" : helpers.mValidarDato( pobDataCell.Headers,       'st'),
						lstHtml           = ( typeof pobDataCell.Html          == 'undefined' ) ? "" : helpers.mValidarDato( pobDataCell.Html,          'st'),
						lstValue          = ( typeof pobDataCell.Value         == 'undefined' ) ? "" : helpers.mValidarDato( pobDataCell.Value,         'st'),
						lobAttributesAdd  = ( typeof pobDataCell.AttributesAdd == 'undefined' ) ? "" : helpers.mValidarDato( pobDataCell.AttributesAdd, 'ob'),
						lobEvents         = ( typeof pobDataCell.Event         == 'undefined' ) ? "" : helpers.mValidarDato( pobDataCell.Event,         'ob');

					if( lstType == "")
					{
						if ( pstTypeTHBF == "thead" )
							lstType = "th";
						else
							lstType = "td";
					}

					var lobCell       = $("<"+lstType+">");

					if( lobAttributesAdd != "" )
						helpers.mParseAttributesAddCell( lobAttributesAdd, lobCell );
					if( lobEvents != "" )
						helpers.mParseEventsCell( lobEvents, lobCell );

					if( lstId != "")
						lobCell.attr('id',lstId);
					if( lstClass != "")
						lobCell.attr('class',lstClass);
					if( lstStyle != "")
						lobCell.attr('style',lstStyle);
					if( lstTabindex != "")
						lobCell.attr('tabindex',lstTabindex);
					if( lstAccesskey != "")
						lobCell.attr('accesskey',lstAccesskey);
					if( lstTitle != "")
						lobCell.attr('title',lstTitle);
					if( lstAbbr != "")
						lobCell.attr('abbr',lstAbbr);
					if( lstScope != "")
						lobCell.attr('scope',lstScope);
					if( lstSorted != "")
						lobCell.attr('sorted',lstSorted);
					if( lstColspan!= "")
						lobCell.attr('colspan',lstColspan);
					if( lstRowspan != "")
						lobCell.attr('rowspan',lstRowspan);
					if( lstHeaders != "")
						lobCell.attr('headers',lstHeaders);

					if( lstHtml != "" && lstValue == "")
					{
						if( lstDataType != "")
							lstHtml = helpers.mDataTypeFormat( lstDataType, lstHtml );

						lobCell.html(lstHtml);
					}
					else if( lstValue != "" && lstHtml == "")
					{
						if( lstDataType != "")
							lstValue = helpers.mDataTypeFormat( lstDataType, lstValue );

						lobCell.text(lstValue);
					}
					else if( lstValue == "" && lstHtml == "")
						lobCell.html("");
					else if( lstValue != "" && lstHtml != "")
					{
						if( lstDataType != "")
							lstHtml = helpers.mDataTypeFormat( lstDataType, lstHtml );

						lobCell.html(lstHtml);
					}

					/*lobCell.on("click",function(event) {
						$(this).css({ 'background-color' : '#ff0000'});
					});*/
					pobRow.append(lobCell);
				});
			},
			mParseCaption: function( pobTable, pobDataCaption )
			{
				var lstId    = ( typeof pobDataCaption.Id    == 'undefined' ) ? "" : helpers.mValidarDato( pobDataCaption.Id,    'st' ),
					lstClass = ( typeof pobDataCaption.Class == 'undefined' ) ? "" : helpers.mValidarDato( pobDataCaption.Class, 'st' ),
					lstStyle = ( typeof pobDataCaption.Style == 'undefined' ) ? "" : helpers.mValidarDato( pobDataCaption.Style, 'st' ),
					lstHtml  = ( typeof pobDataCaption.Html  == 'undefined' ) ? "" : helpers.mValidarDato( pobDataCaption.Html,  'st' );

				if ( lstHtml != "" || lstId != "" )
				{
					var lobCaptionH = $("<caption>");

					if( lstId != "")
						lobCaptionH.attr('id',lstId);
					if( lstClass != "")
						lobCaptionH.attr('class',lstClass);
					if( lstStyle != "")
						lobCaptionH.attr('style',lstStyle);
					if( lstHtml != "")
						lobCaptionH.html(lstHtml);
					else
						lobCaptionH.html("");

					pobTable.append(lobCaptionH);
				}
			},
			mParseColgroup: function(pobTable, pobDataColgroup)
			{
				var lstId    = ( typeof pobDataColgroup.Id    == 'undefined' ) ? "" : helpers.mValidarDato( pobDataColgroup.Id,    'st'),
					lstClass = ( typeof pobDataColgroup.Class == 'undefined' ) ? "" : helpers.mValidarDato( pobDataColgroup.Class, 'st'),
					lstStyle = ( typeof pobDataColgroup.Style == 'undefined' ) ? "" : helpers.mValidarDato( pobDataColgroup.Style, 'st'),
					lstSpan  = ( typeof pobDataColgroup.Span  == 'undefined' ) ? "" : helpers.mValidarDato( pobDataColgroup.Span,  'st'),
					lobCol   = ( typeof pobDataColgroup.Col   == 'undefined' ) ? "" : helpers.mValidarDato( pobDataColgroup.Col,   'ob');

				if ( lstSpan != "" || lstId != "" || lobCol != "" || lstClass != "" || lstStyle != "" )
				{
					var lobColgroup = $("<colgroup>")

					if ( (lstSpan != "" && lobCol == "") || lstId != "" || lstClass != "" || lstStyle != "" )
					{
						if( lstId != "")
							lobColgroup.attr('id',lstId);
						if( lstClass != "")
							lobColgroup.attr('class',lstClass);
						if( lstStyle != "")
							lobColgroup.attr('style',lstStyle);
						if( lstSpan != "")
							lobColgroup.attr('span',lstSpan);

						pobTable.append(lobColgroup);
					}
					else if ( (lstSpan == "" && lobCol != "") || ( lstSpan != "" && lobCol != "" ) )
					{
						if( lstId != "")
							lobColgroup.attr('id',lstId);
						if( lstClass != "")
							lobColgroup.attr('class',lstClass);
						if( lstStyle != "")
							lobColgroup.attr('style',lstStyle);

						helpers.mParseCol( lobColgroup, lobCol);

						pobTable.append(lobColgroup);
					}
				}
			},
			mParseCol: function( pobColgroup, pobDataCol)
			{
				$.each(pobDataCol,function(xC,pobCol)
				{
					var lstId    = ( typeof pobCol.Id    == 'undefined' ) ? "" : helpers.mValidarDato( pobCol.Id,    'st'),
						lstClass = ( typeof pobCol.Class == 'undefined' ) ? "" : helpers.mValidarDato( pobCol.Class, 'st'),
						lstStyle = ( typeof pobCol.Style == 'undefined' ) ? "" : helpers.mValidarDato( pobCol.Style, 'st'),
						lstSpan  = ( typeof pobCol.Span  == 'undefined' ) ? "" : helpers.mValidarDato( pobCol.Span,  'st');

					var lobColH = $("<col>");

					if( lstId != "")
						lobColH.attr('id',lstId);
					if( lstClass != "")
						lobColH.attr('class',lstClass);
					if( lstStyle != "")
						lobColH.attr('style',lstStyle);
					if( lstSpan != "")
						lobColH.attr('span',lstSpan);

					pobColgroup.append(lobColH);
				});
			},
			mDataTypeFormat: function( pstDataType, pstValue )
			{},
			mValidarDato: function( pstDato, pstType )
			{
				if( pstType == 'st' )//-- String
				{
					if( typeof pstDato == 'undefined' )
						return "";
					else
					{
						var  pstDatoTem =  pstDato.toLowerCase();
						pstDato         = (  pstDatoTem == 'undefined' ||  pstDatoTem == 'null' ||  pstDato == ' ' ||  pstDato == '') ? "" :  pstDato;
						return  pstDato;
					}
				}
				else if( pstType == 'ob' )//-- boolean
				{
					if ( helpers.isEmptyJSON(pstDato) )
						return "";
					else
						return pstDato;
				}
				else if( pstType == 'ob' )//-- Object
				{
					var  pstDatoTem =  pstDato.toLowerCase();
					pstDato         = (  pstDatoTem == 'undefined' ||  pstDatoTem == 'null' || pstDatoTem == 'false' ||  pstDato == ' ' ||  pstDato == '' ||  pstDato == '0' ||  pstDato == 0) ? "" :  pstDato;
					return  pstDato;
				}
			},
			isEmptyJSON: function( obj )// validar si el objeto está vacío.
			{
				for ( var i in obj )
				{ return false ; }

				return true ;
			},
			mParseAttributesAddRowConten: function( pobAttributesAdd, pobConten ){},
			mParseAttributesAddRow: function( pobAttributesAdd, pobRow ){},
			mParseEventsRow: function( pobEvents, pobRow ){},
			mParseAttributesAddCell: function( pobAttributesAdd, pobCell ){},
			mParseEventsCell: function( pobEvents, pobCell ){}
		};

		if (methods[method])
			return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
		else if (typeof method === 'object' || !method)
			return methods.init.apply(this, arguments);
		else
			$.error('El Método "' +  method + '" No existe en el plugin createTableJSON! :( ');
	}
})(jQuery);