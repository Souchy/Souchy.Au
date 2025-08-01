
import { WelcomePage } from './welcome-page';

const meta = {
  title: 'Pages/WelcomePage',
  component: WelcomePage,
  render: () => ({
    template: `<welcome-page message.bind="message"></welcome-page>`,
  }),
  argTypes: {
    message: { control: 'text' }
  }
};

export default meta;

export const Default = {
  args: {
    message: 'Welcome to Aurelia 2!'
  }
};

export const CustomWelcome = {
  args: {
    message: 'Welcome to your amazing Aurelia app!'
  }
};

export const StorybookWelcome = {
  args: {
    message: 'Welcome to Storybook + Aurelia 2!'
  }
};

export const LongMessage = {
  args: {
    message: 'Welcome to this comprehensive demonstration of Aurelia 2 components in Storybook!'
  }
};

 