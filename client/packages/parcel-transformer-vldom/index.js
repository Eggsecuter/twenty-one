const { Transformer } = require('@parcel/plugin');

module.exports = new Transformer({
    async transform({asset}) {
        let source = await asset.getCode();

        // regex for => "$foo-bar": this.foo
        source = source.replace(/("\$.*": )(.*)/g, (_, key, value) => {
            let separator = '';

            if (value.at(-1) == ',') {
                value = value.slice(0, -1);
                separator = ',';
            }

            return `${key}(0, _vldom.Component).accessor(() => ${value}, value => ${value} = value)${separator}`
        });
        
        source = source.replaceAll('(0, _component.Component).createElement', 'this.createElement');
        source = source.replaceAll('(0, _vldom.Component).createElement', 'this.createElement');

        asset.setCode(source);

        return [asset];
    }
});
