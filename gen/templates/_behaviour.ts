

declare module <%=moduleName%> {

	/* <%= templateDesc(element) %>
	*/
	interface <%=className%> <% if( element.behaviors ) { %> extends <%=element.behaviors.join(',')%><% } %>
	{	
	<% if( element.events && element.events.length>0 ) { %>/* 
	== EVENTS ==
	
	<%	element.events.forEach( function(e) { %>Event: '<%=e.name%>'  
	<%if( e.params && e.params.length>0 ) {%>Params: <%=templateParams( e.params )%><%}%><%=e.desc%> <% });%>
	*/<%}%>
	
	<%  if (props) { props.forEach(function (p) { %>
		/*<%=p.desc%> 
		*/
		<%= p.name%>:<%=templateType(p)%>;
	<% });} %>
	
	<% if (methods) { methods.forEach(function (m) { %>
		/*<%=m.desc%> 
		*/
		<%= m.name%>(<%=templateParams( m.params )%>);
	<% });} %>

	}	
}