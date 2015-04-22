
/* 
        This script evaluates the the velocity (how fast) the user "turned" the mousewheel, intercepts the event at the specified velocity
        and scrolls the page to he next parallax item. This script requires jquery.mousewheel.js. https://github.com/jquery/jquery-mousewheel
        This scrip works specifically on the Marquee template at Squarespace. I haven't tested it on anything else. jquery.mousewheel and this 
        script need to be added to the index page under setting / advanced page header code injection. Load this script on document ready. 
        Note: this script relys on the Parallax Navigation functionality within that template. If you don't use that feature it won't work.         
*/
var sectionContainer = "[id*=parallax-nav-item]",           //This is the container used by SQS for parallax nav.
scrollVelocityTrigger = 50,                                 //The mousewheel "velocity" at which we should invoke scolling the page.  
loopToTop = true,                                           //If set to true when the user is at th bottom of th page and scrolls down the top.  
goScroll = true,                                            //If set to true the user can scroll normally until the velocity threshold is reached. 
goScrollQuietPeriod = 1200,                                 //The time period after a threshold event where mouseevents will have no effect. 
indexLength = $(sectionContainer).length -1;                //This calculates the total number of parallax "pages" to be used as an index. 

  $(window).mousewheel(function(event){   

/* 
        Here we immediately intercept the mousewhel events for processing. We alos stop propagation to other elements.
        I really have no idea if stop propagation is required but I was getting some funny results without it.
*/

    event.preventDefault();                     
    event.stopImmediatePropagation();   

/*     
        Next we check (goScroll) to see if we are in a quiet period or if we are processing a move. We also check if the mousewheel velocity 
        (event.deltaY) meets our specified threshold (scrollVelocityThreshold) to invoke a move. The deltaY property passed in by the mousewheel event 
        can be positive or negative so Math.abs is used to return the absolute value so we only have to so one conditional check vs checking both positive 
        and negative numbers. If the mousewheel velocity exceeds the threshold we stop further invocation of this function by setting goScroll to false.
*/

    if(goScroll && Math.abs(event.deltaY) > scrollVelocityTrigger){
        goScroll = false;

/*      
        Next we determine wich parallax item the user is currently viewing by looking for the .active class in the parallax-nav-item elements. 
        Note: the prarllax scrolling and the functionality that adds or removes the active class is built by SQS. 
*/       
        var index = $(sectionContainer +".active").index();

/*      
        The next function determines which way the user moved the mousewheel. If the user moved the mousewheel down deltaY will be negative. Up 
        will be positive. However when we move the page we will either increment or decrement the index of the nav-itme. So, if he user scolls down
        we will increment the index by 1. If the user scrolls up we will decrement the index by hence returning -1 or 1. 
*/
        var indexDirection = (event.deltaY > 0) ? -1 : 1;

/*      
        We know we're going to move and we know which direction. Now we check if we are on the last page && if the user scrolled down && if the loop
        logic is set to true. if so, set the index to 0, the first page. If not add indexDirection to index which will increment or decrement the index. 
        Then artificially click the nav element with that index. Note: Math.max is used to avoid a negative index number. If there is a negative number
        we go to or stay on the first page.    
*/
        (index == indexLength && indexDirection > 0 && loopToTop) ? index = 0 : index = Math.max(0, index += indexDirection);
        $(sectionContainer +":eq("+ index +") a .nav-title").click();

/*      
        Set a quiet period where we don't respond to other mousewheel events. When the time period specified by goScrollQuietPeriod expires
        goScroll will be set to true allowing other mousewheel events to be processed. 
*/
        setTimeout(function(){
            goScroll = true;
        }, goScrollQuietPeriod);
    } 
  });   

