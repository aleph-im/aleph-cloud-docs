import { defineConfig } from 'vitepress'
import redirectPlugin from 'vite-plugin-redirect';

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "Aleph Cloud",
  description: "Aleph Cloud Main Documentation",
  ignoreDeadLinks: true,
  markdown: {
    math: true
  },
  srcExclude: ["tools/**"],
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    logo: {
      light: '/aleph-cloud-logo-light-bg.svg',
      dark: '/aleph-cloud-logo-dark-bg.svg'
    },
    siteTitle: false,
    nav: [
      { text: 'Home', link: '/', activeMatch: '^/$' },
      { text: 'About', link: '/about', activeMatch: '^/about/' },
      { text: 'Nodes', link: '/nodes', activeMatch: '^/nodes/' },
      { text: 'DevHub', link: '/devhub', activeMatch: '^/devhub/' },
    ],

    search: {
      provider: 'local',
      options: {
        locales: {
          root: {
            translations: {
              button: {
                buttonText: 'Search',
                buttonAriaLabel: 'Search documentation'
              },
              modal: {
                noResultsText: 'No results for',
                resetButtonTitle: 'Clear search query',
                footer: {
                  selectText: 'to select',
                  navigateText: 'to navigate',
                  closeText: 'to close'
                }
              }
            }
          }
        },
        detailedView: true
      }
    },

    // Sidebar configuration with path-based keys
    sidebar: {
      // Default sidebar (shown on the homepage and other pages without specific sidebar)
      '/': [
        {
          text: 'Introduction',
          items: [
            { text: 'Overview', link: '/' },
            { text: 'FAQ', link: '/faq' },
          ]
        }
      ],

      // About section sidebar (previous "What is Aleph Cloud?")
      '/about/': [
        {
          text: 'About Aleph Cloud',
          items: [
            { text: 'Overview', link: '/about/' },
            { text: 'How it Works', link: '/about/how-it-works/' },
            { text: 'Use Cases', link: '/about/use-cases/' }
          ]
        },
        {
          text: 'Network',
          items: [
            { text: 'Architecture', link: '/about/network/architecture/' },
            { text: 'Message Types', link: '/about/network/message-types/' },
            { text: 'Consensus', link: '/about/network/consensus/' },
            { text: 'Supported Blockchains', link: '/about/network/supported-blockchains/' }
          ]
        },
        {
          text: 'Resources',
          items: [
            { text: 'Community', link: '/about/resources/community/' }
          ]
        }
      ],

      // Nodes section sidebar with titles, dividers, and non-clickable headers
      '/nodes/': [
        {
          text: 'Nodes',
          items: [
            { text: 'Overview', link: '/nodes/' }
          ]
        },
        {
          text: 'Staking',
          items: [
            { text: 'How-to', link: '/nodes/staking/' }
          ]
        },
        {
          text: 'Core Channel Nodes',
          items: [
            { text: 'Introduction', link: '/nodes/core/introduction/' },
            { text: 'Installation', link: '/nodes/core/installation/' }
          ]
        },
        {
          text: 'Compute Resource Nodes',
          items: [
            { text: 'Introduction', link: '/nodes/compute/introduction/' },
            { text: 'Installation',
              collapsed: true,
              items: [
                {text: 'Debian 12', link: '/nodes/compute/installation/debian-12/'},
                {text: 'Ubuntu 24.04', link: '/nodes/compute/installation/ubuntu-24.04/'}
              ]
             },
            { text: 'Advanced Features',
              collapsed: false,
              items: [
                { text: 'Enable Confidential', link: '/nodes/compute/advanced/confidential/' },
                { text: 'Enable GPU', link: '/nodes/compute/advanced/gpu/' },
                { text: 'Enable Pay-as-you-go', link: '/nodes/compute/advanced/pay-as-you-go/' },
                { text: 'Local Testing', link: '/nodes/compute/advanced/local-testing/' }
              ]
            }
          ]
        },
        {
          text: 'Resources',
          items: [
            {
              text: 'Node Management',
              collapsed: true,
              items: [
                { text: 'Backups', link: '/nodes/resources/management/backups/' },
                { text: 'Monitoring', link: '/nodes/resources/management/monitoring/' },
                { text: 'Troubleshooting', link: '/nodes/resources/management/troubleshooting/' }
              ]
            },
            { text: 'Metrics', link: '/nodes/resources/metrics/' },
            { text: 'Scoring', link: '/nodes/resources/scoring/' },
            { text: 'Rewards', link: '/nodes/resources/rewards/' },
            { text: 'Releases', link: '/nodes/resources/releases/' }
          ]
        }
      ],


      // DevHub section sidebar (previous "Development Hub")
      '/devhub/': [
        {
          text: 'Developer Hub',
          items: [
            { text: 'Overview', link: '/devhub/' },
            { text: 'Getting Started', link: '/devhub/getting-started/' },
            { text: 'FAQ', link: '/devhub/faq/' }
          ]
        },
        {
          text: 'Building Applications',
          collapsed: false,
          items: [
            { text: 'Authentication', link: '/devhub/building-applications/authentication/' },
            { text: 'Data Storage',
              collapsed: false,
              items: [
                { text: 'Overview', link: '/devhub/building-applications/data-storage/overview' },
                { text: 'Getting Started', link: '/devhub/building-applications/data-storage/getting-started' },
                { text: 'Types of Storage',
                  collapsed: true,
                  items: [
                    { text: 'Immutable Volume', link: '/devhub/building-applications/data-storage/types-of-storage/immutable-volume' },
                    { text: 'Persistent Storage', link: '/devhub/building-applications/data-storage/types-of-storage/persistent-storage' }
                  ]
                },
                { text: 'IPFS Pinning', link: '/devhub/storage/ipfs-pinning/' }
              ]
            },
            { text: 'Messaging',
              collapsed: false,
              items:[
                { text: 'Overview', link: '/devhub/building-applications/messaging/' },
                { text: 'Permissions', link: '/devhub/building-applications/messaging/permissions' },
                { text: 'Object Types',
                  collapsed: true,
                  items: [
                    { text: 'Aggregates', link: '/devhub/building-applications/messaging/object-types/aggregates' },
                    { text: 'Posts', link: '/devhub/building-applications/messaging/object-types/posts' },
                    { text: 'Store', link: '/devhub/building-applications/messaging/object-types/store' },
                    { text: 'Programs', link: '/devhub/building-applications/messaging/object-types/programs' },
                    { text: 'Forget', link: '/devhub/building-applications/messaging/object-types/forget' }
                  ]
                }
              ]
            }
          ]
        },
        {
          text: 'Compute Resources',
          collapsed: false,
          items: [
            { text: 'Standard Instances', link: '/devhub/compute-resources/standard-instances/' },
            { text: 'GPU Instances', link: '/devhub/compute-resources/gpu-instances/' },
            {
              text: 'Confidential Instances',
              collapsed: true,
              items: [
                { text: 'Introduction', link: '/devhub/compute-resources/confidential-instances/01-confidential-instance-introduction' },
                { text: 'Requirements', link: '/devhub/compute-resources/confidential-instances/02-confidential-instance-requirements' },
                { text: 'Encrypted Disk Image', link: '/devhub/compute-resources/confidential-instances/03-confidential-instance-create-encrypted-disk' },
                { text: 'Instance Creation', link: '/devhub/compute-resources/confidential-instances/04-confidential-instance-deploy' },
                { text: 'Troubleshooting', link: '/devhub/compute-resources/confidential-instances/05-confidential-instance-troubleshooting' }
              ]
            },
            { text: 'Functions',
              collapsed: true,
              items: [
                { text: 'Overview', link: '/devhub/compute-resources/functions/' },
                { text: 'Getting Started', link: '/devhub/compute-resources/functions/getting-started' },
                {
                  text: 'Create & Manage',
                  collapsed: true,
                  items: [
                    { text: 'Using the CLI ↗', link: '/devhub/sdks-and-tools/aleph-cli/commands/program.html' },
                    {
                      text: 'Using the Web Console',
                      collapsed: true,
                      items: [
                        { text: 'Overview', link: '/devhub/compute-resources/functions/webconsole/' },
                        { text: 'Upload', link: '/devhub/compute-resources/functions/webconsole/upload' },
                        { text: 'Write Your Code', link: '/devhub/compute-resources/functions/webconsole/write_your_code' },
                        {
                          text: 'Languages',
                          collapsed: true,
                          items: [
                            { text: 'Python', link: '/devhub/compute-resources/functions/webconsole/languages/python' },
                            { text: 'Node.js', link: '/devhub/compute-resources/functions/webconsole/languages/nodejs' },
                            { text: 'Other', link: '/devhub/compute-resources/functions/webconsole/languages/other' }
                          ]
                        }
                      ]
                    }
                  ]
                },
                { text: 'Advanced',
                  collapsed: true,
                  items: [
                    { text: 'Test Functions', link: '/devhub/compute-resources/functions/advanced/test-programs' },
                    { text: 'Update Functions', link: '/devhub/compute-resources/functions/advanced/update-programs' },
                    { text: 'Custom Builds',
                      collapsed: true,
                      items: [
                        { text: 'Python',
                          collapsed: true,
                          items: [
                            { text: 'Getting Started', link: '/devhub/compute-resources/functions/advanced/custom-builds/python/getting-started/' },
                            { text: 'Advanced Features', link: '/devhub/compute-resources/functions/advanced/custom-builds/python/advanced/features' },
                            { text: 'Dependency Volumes', link: '/devhub/compute-resources/functions/advanced/custom-builds/python/advanced/dependency-volumes' }
                          ]
                        },
                        { text: 'Rust', link: '/devhub/compute-resources/functions/advanced/custom-builds/rust' }
                      ]
                    }
                  ]
                }
              ]
            },
            { text: 'Payment Models',
              collapsed: true,
              items: [
                { text: 'Holding', link: '/devhub/compute-resources/payment-models/holding/' },
                { text: 'Pay-As-You-Go', link: '/devhub/compute-resources/payment-models/pay-as-you-go/' }
              ]
            }
          ]
        },
        {
          text: 'Deploying & Hosting',
          collapsed: false,
          items: [
            { text: 'Custom Domains', link: '/devhub/deploying-and-hosting/custom-domains/setup' },
            { text: 'Web Hosting', link: '/devhub/deploying-and-hosting/web-hosting/' },
            { text: 'Ipv4 Port forwarding', link: 'devhub/deploying-and-hosting/ipv4/ipv4-port-forwarding' },
          ]
        },
        {
          text: 'Working with Blockchain Data',
          collapsed: false,
          items: [
            { text: 'Indexing',
              collapsed: true,
              items: [
                { text: 'Overview', link: '/devhub/building-applications/blockchain-data/indexing/' },
                { text: 'EVM Indexer', link: '/devhub/building-applications/blockchain-data/indexing/evm-indexer' },
                { text: 'Solana IDL Indexer', link: '/devhub/building-applications/blockchain-data/indexing/solana-idl-indexer' }
              ]
            }
          ]
        },
        {
          text: 'SDKs & Tools',
          collapsed: false,
          items: [
            { text: 'TypeScript SDK', link: '/devhub/sdks-and-tools/typescript-sdk/' },
            { text: 'Python SDK', link: '/devhub/sdks-and-tools/python-sdk/' },
            {
              text: 'Aleph CLI',
              link: '/devhub/sdks-and-tools/aleph-cli/',
              collapsed: false,
              items: [
                { text: 'Account Management', link: '/devhub/sdks-and-tools/aleph-cli/commands/account' },
                { text: 'File Operations', link: '/devhub/sdks-and-tools/aleph-cli/commands/file' },
                { text: 'Function Deployment', link: '/devhub/sdks-and-tools/aleph-cli/commands/program' },
                { text: 'Instance Management', link: '/devhub/sdks-and-tools/aleph-cli/commands/instance' },
                { text: 'Pricing Information', link: '/devhub/sdks-and-tools/aleph-cli/commands/pricing' },
                { text: 'Message Management', link: '/devhub/sdks-and-tools/aleph-cli/commands/message' },
                { text: 'Aggregate Management', link: '/devhub/sdks-and-tools/aleph-cli/commands/aggregate' },
                { text: 'Domain Management', link: '/devhub/sdks-and-tools/aleph-cli/commands/domain' },
                { text: 'Node Information', link: '/devhub/sdks-and-tools/aleph-cli/commands/node' },
                { text: 'About', link: '/devhub/sdks-and-tools/aleph-cli/commands/about' }
              ]
            },
            { text: 'VRF', link: '/devhub/tools/vrf/' }
          ]
        },
        {
          text: 'API Reference',
          collapsed: true,
          items: [
            { text: 'REST API', link: '/devhub/api-reference/rest' }
          ]
        },
        {
          text: 'Example Projects',
          collapsed: true,
          items: [
            { text: 'Web3 Applications', link: '/devhub/building-applications/examples/web3-apps/' },
            { text: 'DeFi Integration', link: '/devhub/building-applications/examples/defi/' },
            { text: 'NFT Projects', link: '/devhub/building-applications/examples/nft/' },
            { text: 'Gaming', link: '/devhub/building-applications/examples/gaming/' }
          ]
        }
      ]
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/aleph-im' }
    ]
  },
  plugins : [
    // Redirect Links from the old doc
    redirectPlugin({
      redirects: {
        // Community section -> About section
        '/community/blog/': '/about/resources/community/',
        '/community/use-cases/': '/about/use-cases/',
        '/community/projects/': '/about/resources/community/',

        // Computing section -> DevHub/compute-resources
        '/computing/': '/devhub/compute-resources/standard-instances/',
        '/computing/confidential/': '/devhub/compute-resources/confidential-instances/01-confidential-instance-introduction',
        '/computing/confidential/encrypted-disk/': '/devhub/compute-resources/confidential-instances/03-confidential-instance-create-encrypted-disk',
        '/computing/confidential/instance/': '/devhub/compute-resources/confidential-instances/04-confidential-instance-deploy',
        '/computing/confidential/requirements/': '/devhub/compute-resources/confidential-instances/02-confidential-instance-requirements',
        '/computing/confidential/troubleshooting/': '/devhub/compute-resources/confidential-instances/05-confidential-instance-troubleshooting',
        '/computing/custom_domain/setup/': '/devhub/deploying-and-hosting/custom-domains/setup',
        '/computing/gpu/': '/devhub/compute-resources/gpu-instances/',
        '/computing/runtimes/': '/devhub/compute-resources/functions/',
        '/computing/runtimes/custom/': '/devhub/compute-resources/functions/advanced/custom-builds/',
        '/computing/volumes/immutable/': '/devhub/building-applications/data-storage/types-of-storage/immutable-volume',
        '/computing/volumes/persistent/': '/devhub/building-applications/data-storage/types-of-storage/persistent-storage',

        // Guides -> DevHub sections
        '/guides/testing_microvms/': '/devhub/compute-resources/functions/advanced/test-programs',
        '/guides/update_a_program/': '/devhub/compute-resources/functions/advanced/update-programs',
        '/guides/python/advanced/': '/devhub/compute-resources/functions/advanced/custom-builds/python/advanced/features',
        '/guides/python/dependency_volume/': '/devhub/compute-resources/functions/advanced/custom-builds/python/advanced/dependency-volumes',
        '/guides/python/getting_started/': '/devhub/compute-resources/functions/advanced/custom-builds/python/getting-started/',
        '/guides/rust/rust_microvm/': '/devhub/compute-resources/functions/advanced/custom-builds/rust',

        // Libraries -> DevHub/sdks-and-tools
        '/libraries/networks/': '/devhub/api-reference/rest',
        '/libraries/python-sdk/': '/devhub/sdks-and-tools/python-sdk/',
        '/libraries/python-sdk/accounts/': '/devhub/sdks-and-tools/python-sdk/accounts',
        '/libraries/python-sdk/error/': '/devhub/sdks-and-tools/python-sdk/error',
        '/libraries/python-sdk/forget/': '/devhub/sdks-and-tools/python-sdk/forget',
        '/libraries/python-sdk/aggregates/create/': '/devhub/sdks-and-tools/python-sdk/aggregates/create',
        '/libraries/python-sdk/aggregates/delegate/': '/devhub/sdks-and-tools/python-sdk/aggregates/delegate',
        '/libraries/python-sdk/aggregates/query/': '/devhub/sdks-and-tools/python-sdk/aggregates/query',
        '/libraries/python-sdk/posts/create/': '/devhub/sdks-and-tools/python-sdk/posts/create',
        '/libraries/python-sdk/posts/query/': '/devhub/sdks-and-tools/python-sdk/posts/query',
        '/libraries/typescript-sdk/': '/devhub/sdks-and-tools/typescript-sdk/',
        '/libraries/typescript-sdk/accounts/': '/devhub/sdks-and-tools/typescript-sdk/accounts',
        '/libraries/typescript-sdk/aggregates/': '/devhub/sdks-and-tools/typescript-sdk/aggregates',
        '/libraries/typescript-sdk/instances/': '/devhub/sdks-and-tools/typescript-sdk/instances',
        '/libraries/typescript-sdk/posts/': '/devhub/sdks-and-tools/typescript-sdk/posts',
        '/libraries/typescript-sdk/troubleshooting/': '/devhub/sdks-and-tools/typescript-sdk/troubleshooting',

        // Nodes section
        '/nodes/compute/': '/nodes/compute/introduction/',
        '/nodes/compute/releases/': '/nodes/resources/releases/',
        '/nodes/compute/troubleshooting/': '/nodes/resources/management/troubleshooting/',
        '/nodes/compute/advanced/enable-confidential/': '/nodes/compute/advanced/confidential/',
        '/nodes/compute/advanced/enable-gpu/': '/nodes/compute/advanced/gpu/',
        '/nodes/compute/advanced/enable-payg/': '/nodes/compute/advanced/pay-as-you-go/',
        '/nodes/compute/advanced/local-testing/': '/nodes/compute/advanced/local-testing/',
        '/nodes/compute/installation/configure-caddy/': '/nodes/compute/installation/',
        '/nodes/compute/installation/debian-12/': '/nodes/compute/installation/debian-12/',
        '/nodes/compute/installation/ubuntu-22.04/': '/nodes/compute/installation/ubuntu-22.04/',
        '/nodes/compute/installation/ubuntu-24.04/': '/nodes/compute/installation/ubuntu-24.04/',
        '/nodes/core/': '/nodes/core/introduction/',
        '/nodes/core/backups/': '/nodes/resources/management/backups/',
        '/nodes/reliability/': '/nodes/resources/management/',
        '/nodes/reliability/metrics/': '/nodes/resources/metrics/',
        '/nodes/reliability/monitoring/': '/nodes/resources/management/monitoring/',
        '/nodes/reliability/rewards/': '/nodes/resources/rewards/',
        '/nodes/reliability/scores/': '/nodes/resources/scoring/',
        '/nodes/reliability/troubleshooting/': '/nodes/resources/management/troubleshooting/',

        // Protocol section -> About/DevHub sections
        '/protocol/chains/': '/about/network/supported-blockchains/',
        '/protocol/messages/': '/about/network/message-types/',
        '/protocol/permissions/': '/devhub/building-applications/messaging/permissions',
        '/protocol/usage/': '/about/how-it-works/',
        '/protocol/object-types/aggregates/': '/devhub/building-applications/messaging/object-types/aggregates',
        '/protocol/object-types/posts/': '/devhub/building-applications/messaging/object-types/posts',
        '/protocol/object-types/programs/': '/devhub/building-applications/messaging/object-types/programs',
        '/protocol/object-types/storage/': '/devhub/building-applications/messaging/object-types/store',

        // Tools section -> DevHub sections
        '/tools/aleph-account/': '/nodes/staking/',
        '/tools/ipfs-pinning/': '/devhub/storage/ipfs-pinning/',
        '/tools/vrf/': '/devhub/tools/vrf/',
        '/tools/web3-hosting/': '/devhub/deploying-and-hosting/web-hosting/',
        '/tools/aleph-client/': '/devhub/sdks-and-tools/aleph-cli/',
        '/tools/aleph-client/troubleshooting/': '/devhub/sdks-and-tools/aleph-cli/troubleshooting',
        '/tools/aleph-client/usage/': '/devhub/sdks-and-tools/aleph-cli/usage',
        '/tools/indexer/': '/devhub/building-applications/blockchain-data/indexing/',
        '/tools/indexer/evm-indexer/': '/devhub/building-applications/blockchain-data/indexing/evm-indexer',
        '/tools/indexer/indexer-generator/': '/devhub/building-applications/blockchain-data/indexing/solana-idl-indexer',
        '/tools/webconsole/': '/devhub/compute-resources/functions/webconsole/',
        '/tools/webconsole/upload/': '/devhub/compute-resources/functions/webconsole/upload',
        '/tools/webconsole/write_your_code/': '/devhub/compute-resources/functions/webconsole/write_your_code',
        '/tools/webconsole/languages/nodejs/': '/devhub/compute-resources/functions/webconsole/languages/nodejs',
        '/tools/webconsole/languages/other/': '/devhub/compute-resources/functions/webconsole/languages/other',
        '/tools/webconsole/languages/python/': '/devhub/compute-resources/functions/webconsole/languages/python'
      }
    })


  ]
  


})