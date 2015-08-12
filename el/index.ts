/// <reference path="../typings/yeoman-generator/yeoman-generator.d.ts"/>
/// <reference path='../typings/underscore.string/underscore.string.d.ts' />
///  <reference path='../typings/cheerio/cheerio.d.ts' />

//import $ = require('cheerio');

import path = require("path");

import _s = require('underscore.string');

import yeoman = require("yeoman-generator");

module generator {

  export interface IMemFsEditor {
  
    /**
    from: Path
    to: Path
    context: template variables
    options:
    */
    copyTpl(from:string, to:string, context:Object, options?:any);
    
    exists( path:string ):boolean;
    
    read( path:string, options?:any ):string|Buffer;
    write( path:string, contents:string|Buffer );
    
    
  }


  export interface IOptions {
    path:string;
  }
  
  export interface IElement extends yeoman.IYeomanGenerator {
    fs:IMemFsEditor;

    includeImport:boolean;
    elementName:string;
    className:string;
    pathToBower:string;        
    options:IOptions;
   
    dependencies:Array<String>;
    // custom
    existsElementsFile();
  }
 
}
 
var generator = yeoman.generators.Base.extend({
  constructor: function () {
    yeoman.generators.Base.apply(this, arguments);

    //console.log( "constructor!");
    ((yo:generator.IElement) => {
    
      yo.existsElementsFile  = () => {
       return  yo.fs.exists('app/elements/elements.html');
      }
      
      yo.dependencies = [ "polymer-ts" ];

      yo.argument("elementName",
        {required:true, type:'string' ,desc:"element name. Must contains dash symbol!"});

      yo.option("path",{desc:"element output path", defaults:"app"})  
      
    })(this);
    
  },
  initializing: function() {
    //console.log( "initializing!");

    ((yo:generator.IElement) => {
      
      if (yo.elementName.indexOf('-') === -1) {
        yo.emit('error', new Error(
          'Element name must contain a dash "-"\n' +
          'ex: yo polymer:el my-element'
        ));
      }


    })(this);


  },
  prompting: function () {

    //console.log( "prompting!" );

    ((yo:generator.IElement) => {

      if( !yo.existsElementsFile() ) return;
      
      var done = yo.async();

      var prompts = [
        {
          name: 'includeImport',
          message: 'Would you like to include an import in your elements.html file?',
          type: 'confirm',
          default: false
        }
      ];

      yo.prompt(prompts, function (answers:any) {
        yo.includeImport = answers.includeImport;
        done();
      }.bind(yo));

    })(this);

  },
  configuring: function() {
    //console.log( "configuring!" );

    ((yo:generator.IElement) => {


    })(this);


  },
  element : function() {
      //console.log( "element writing!");

      ((yo:generator.IElement) => {
        
        console.log( "writing" );
        
        // el = "x-foo/x-foo"
        var  el = path.join(this.elementName, this.elementName);

        // pathToEl = "app/elements/foo/bar/x-foo"
        var pathToEl = path.join(yo.options.path, "elements", el);
    
 
        console.log( "el", el, "pathToEl", pathToEl);

        // Used by element template
        yo.pathToBower = path.relative(
          path.dirname(pathToEl),
          path.join(process.cwd(), yo.options.path, 'bower_components')
        );
        
        yo.template(path.join(__dirname, 'templates/_element.html'), pathToEl.concat('.html'));
        
        yo.className = _s.classify(yo.elementName)
  
        yo.template(path.join(__dirname, 'templates/_element.ts'), pathToEl.concat('.ts'));
    
        // Wire up the dependency in elements.html
        if (yo.includeImport && yo.existsElementsFile()) {
  
            var elementsPath = path.join( yo.options.path,'elements/elements.html')
            var file = yo.fs.read(elementsPath);
            el = el.replace('\\', '/');
            file += '<link rel="import" href="' + el + '.html">\n';
            yo.fs.write(elementsPath, file);
        }

      })(this);

  },
  end:function() {
    //console.log( "end" );

    ((yo:generator.IElement) => {

    })(this);

  }

} );


module.exports = generator;
