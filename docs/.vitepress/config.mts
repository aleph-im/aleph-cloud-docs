import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "Aleph Cloud",
  description: "Aleph Cloud Main Documentation",
  ignoreDeadLinks: true,
  markdown: {
    math: true
  },
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    logo: {
      light: '/aleph-cloud-logo-light-bg.svg',
      dark: '/aleph-cloud-logo-dark-bg.svg'
    },
    siteTitle: false,
    nav: [
      { text: 'Home', link: '/' },
      { text: 'About', link: '/about' },
      { text: 'Nodes', link: '/nodes' },
      { text: 'DevHub', link: '/devhub' }
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
            { text: 'Components Demo', link: '/test-components' }
          ]
        }
      ],
      
      // About section sidebar (previous "What is Aleph.im?")
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
            { text: 'Consensus', link: '/about/network/consensus/' }
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
                {text: 'Ubuntu 22.04', link: '/nodes/compute/installation/ubuntu-24.04/'}
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
            { text: 'Web Hosting', link: '/devhub/deploying-and-hosting/web-hosting/' }
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
                { text: 'Instance Management', link: '/devhub/sdks-and-tools/aleph-cli/commands/instance' }
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
      { icon: 'github', link: 'https://github.com/vuejs/vitepress' }
    ]
  }
})
