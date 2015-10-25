var flowSchema = new mongoose.Schema({
  title: String,
  slug: String,
  inputs: [],
  outputs: []
},
{
	strict: true
}
);

module.exports = flowSchema;