import fivebeans from "fivebeans";

const NODE = "hsa1013-beanstalkd:11301";

function buildClient(queue = "default") {
    try {
        const beanstalkd = new fivebeans.client(NODE.split(":")[0], NODE.split(":")[1]);

        beanstalkd.on("connect", () => {
            console.log('Beanstalkd connection stablished.');
        });

        beanstalkd.on("error", (error) => {
            console.log('Beanstalkd error: ', error, ".");
        });

        beanstalkd.on("close", () => {
            console.log('Beanstalkd connection closed.');
        })

        beanstalkd.connect();

        beanstalkd.use(queue, () => {
            console.log('Beanstalkd using queue: ', queue);
        });

        return beanstalkd;   
    } catch (error) {
        console.error('Could not create a beanstalkd client, error: ', error);

        return null;
    }
}

export default buildClient;