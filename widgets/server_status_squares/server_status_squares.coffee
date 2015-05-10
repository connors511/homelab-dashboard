class Dashing.ServerStatusSquares extends Dashing.Widget

	onData: (data) ->
		color = if data.result == 1 then "#96BF48" else "#BF4848"

		console.log("Last status", @lastStatus)
		if @lastStatus != data.result
			$(@node).fadeOut().fadeIn()
			@lastStatus = data.result

			if !@lastStatus
				console.log("Setting interval")
				node = $(@node)
				@interval = setInterval ->
					node.fadeOut().fadeIn()
				, 3000
			else if @interval
				clearInterval(@interval)

		$(@get('node')).css('background-color', "#{color}")
