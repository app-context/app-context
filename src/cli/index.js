import CommandContainer from '../command-container';

const commands = new CommandContainer('app-context');

commands.addDirectory(__dirname);

export default async function(argv) {
  const code = await commands.execute(argv);
  process.exit(code);
}
