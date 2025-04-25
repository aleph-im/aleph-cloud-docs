# Developer Hub Restructuring Plan

## Content Mapping: Current Structure to New Structure

This document maps the current Developer Hub content to the proposed new structure, identifying what exists and where content gaps need to be filled.

### Legend
- ✅ Content exists and can be moved directly
- 🔄 Content exists but needs modification/updating
- 🆕 New content needed (content gap)

## New Structure Content Map

### Developer Hub
- **Overview** 
  - ✅ `/devhub/index.md`

- **Getting Started**
  - ✅ `/devhub/getting-started/index.md`

### Building Applications

- **Authentication**
  - ✅ `/devhub/guides/authentication/index.md`

- **Data Storage**
  - ✅ `/devhub/guides/storage/overview.md`
  - ✅ `/devhub/guides/storage/getting-started.md`
  - ✅ `/devhub/guides/storage/types-of-storage/immutable-volume.md`
  - ✅ `/devhub/guides/storage/types-of-storage/persistent-storage.md`

- **Messaging**
  - ✅ `/devhub/guides/messages/index.md`
  - ✅ `/devhub/guides/messages/object-types/aggregates.md`
  - ✅ `/devhub/guides/messages/object-types/forget.md`
  - ✅ `/devhub/guides/messages/object-types/posts.md`
  - ✅ `/devhub/guides/messages/object-types/programs.md`
  - ✅ `/devhub/guides/messages/object-types/store.md`

### Compute Resources

- **Standard Instances**
  - ✅ `/devhub/computing/instances/general-instances.md`
  - 🔄 Need to update with more comprehensive content

- **GPU Instances**
  - ✅ `/devhub/computing/instances/gpu-instances.md`

- **Confidential Instances**
  - ✅ `/devhub/computing/instances/confidential/01-confidential-instance-introduction.md`
  - ✅ `/devhub/computing/instances/confidential/02-confidential-instance-requirements.md`
  - ✅ `/devhub/computing/instances/confidential/03-confidential-instance-create-encrypted-disk.md`
  - ✅ `/devhub/computing/instances/confidential/04-confidential-instance-deploy.md`
  - ✅ `/devhub/computing/instances/confidential/05-confidential-instance-troubleshooting.md`

- **Functions**
  - ✅ `/devhub/computing/functions/index.md`
  - ✅ `/devhub/computing/functions/getting-started.md`
  - ✅ `/devhub/computing/functions/advanced/test-programs.md`
  - ✅ `/devhub/computing/functions/advanced/update-programs.md`
  - ✅ `/devhub/computing/functions/advanced/custom-builds/python/getting-started/index.md`
  - ✅ `/devhub/computing/functions/advanced/custom-builds/python/advanced/dependency-volumes.md`
  - ✅ `/devhub/computing/functions/advanced/custom-builds/python/advanced/features.md`
  - ✅ `/devhub/computing/functions/advanced/custom-builds/rust.md`

- **Payment Models**
  - **Staking**
    - 🆕 No dedicated content exists - **CONTENT GAP**
    - Some information exists in CCN documentation but needs to be adapted for developers
  
  - **Pay-As-You-Go**
    - 🆕 No dedicated content exists - **CONTENT GAP**
    - Some information exists in CRN documentation but needs to be adapted for developers

### Deploying & Hosting

- **Custom Domains**
  - ✅ `/devhub/guides/custom-domains/setup.md`

- **Web Hosting**
  - 🆕 No dedicated content exists - **CONTENT GAP**
  - Need to create content about hosting websites on Aleph.im

### Working with Blockchain Data

- **Indexing**
  - ✅ `/devhub/guides/indexing/index.md`
  - ✅ `/devhub/guides/indexing/evm-indexer.md`
  - ✅ `/devhub/guides/indexing/solana-idl-indexer.md`

### SDKs & Tools

- **TypeScript SDK**
  - ✅ `/devhub/sdks-and-tools/typescript/index.md`
  - 🔄 Could use more comprehensive examples and API documentation

- **Python SDK**
  - ✅ `/devhub/sdks-and-tools/python/index.md`
  - 🔄 Could use more comprehensive examples and API documentation

- **Aleph CLI**
  - ✅ `/devhub/sdks-and-tools/aleph-cli/index.md`
  - ✅ `/devhub/sdks-and-tools/aleph-cli/commands/account.md`
  - ✅ `/devhub/sdks-and-tools/aleph-cli/commands/file.md`
  - ✅ `/devhub/sdks-and-tools/aleph-cli/commands/program.md`
  - ✅ `/devhub/sdks-and-tools/aleph-cli/commands/instance.md`

### API Reference

- **REST API**
  - ✅ `/devhub/api/rest.md`
  - 🔄 Could use more comprehensive documentation and examples

### Example Projects

- **Web3 Applications**
  - ✅ `/devhub/examples/web3-apps/index.md`
  - 🔄 Could use more practical examples

- **DeFi Integration**
  - ✅ `/devhub/examples/defi/index.md`
  - 🔄 Could use more practical examples

- **NFT Projects**
  - ✅ `/devhub/examples/nft/index.md`
  - 🔄 Could use more practical examples

- **Gaming**
  - ✅ `/devhub/examples/gaming/index.md`
  - 🔄 Could use more practical examples

## Content Gaps Summary

The following areas need new content to be created:

1. **Payment Models**
   - Need dedicated documentation for both Staking and Pay-As-You-Go models
   - Should explain how developers can choose and implement different payment options
   - Include pricing information, trade-offs, and best practices

2. **Web Hosting**
   - Need documentation on how to host static websites on Aleph.im
   - Should include deployment process, configuration options, and best practices
   - Include information about performance, reliability, and limitations

3. **SDK Documentation Improvements**
   - Both TypeScript and Python SDKs could use more comprehensive API documentation
   - Need more practical code examples for common use cases

4. **Example Projects**
   - All example sections could benefit from more detailed, practical examples
   - Should include complete code samples that developers can adapt

## Next Steps

1. Create the new directory structure according to the proposed organization
2. Move existing content to the appropriate locations
3. Identify resources for creating content to fill the gaps
4. Update navigation in config.mts to reflect the new structure
