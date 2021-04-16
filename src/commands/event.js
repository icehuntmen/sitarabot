module.exports = {
    name: 'event',
    description: 'Create all types ',
    async execute(message, unite, args) {
		const newEvent = await new unite.lfg.publicEvent.Events(unite)
		newEvent.run(message,args)

        //const channelSave =  await new unite.manager.ChannelManager(unite);
        //const channel = await channelSave.getChannel('732254210011430953')


        //devs.showObject(channel,1)
    }

}