/* global describe it before ethers */

const {
  getSelectors,
  FacetCutAction,
  removeSelectors,
  findAddressPositionInFacets
} = require('../scripts/libraries/diamond.js')

const { deployDiamond } = require('../scripts/deploy.js')

const { assert } = require('chai')

describe('DiamondTest', async function () {
  let diamondAddress
  let diamondCutFacet
  let diamondLoupeFacet
  let ownershipFacet
  let tx
  let receipt
  let result
  const addresses = []

  before(async function () {
    diamondAddress = await deployDiamond()
    diamondCutFacet = await ethers.getContractAt('DiamondCutFacet', diamondAddress)
    diamondLoupeFacet = await ethers.getContractAt('DiamondLoupeFacet', diamondAddress)
    ownershipFacet = await ethers.getContractAt('OwnershipFacet', diamondAddress)
  })

  it('should have three facets -- call to facetAddresses function', async () => {
    for (const address of await diamondLoupeFacet.facetAddresses()) {
      addresses.push(address)
    }

    assert.equal(addresses.length, 3)
  })

  it('facets should have the right function selectors -- call to facetFunctionSelectors function', async () => {
    let selectors = getSelectors(diamondCutFacet)
    result = await diamondLoupeFacet.facetFunctionSelectors(addresses[0])
    assert.sameMembers(result, selectors)
    selectors = getSelectors(diamondLoupeFacet)
    result = await diamondLoupeFacet.facetFunctionSelectors(addresses[1])
    assert.sameMembers(result, selectors)
    selectors = getSelectors(ownershipFacet)
    result = await diamondLoupeFacet.facetFunctionSelectors(addresses[2])
    assert.sameMembers(result, selectors)
  })

  it('selectors should be associated to facets correctly -- multiple calls to facetAddress function', async () => {
    assert.equal(
      addresses[0],
      await diamondLoupeFacet.facetAddress('0x1f931c1c')
    )
    assert.equal(
      addresses[1],
      await diamondLoupeFacet.facetAddress('0xcdffacc6')
    )
    assert.equal(
      addresses[1],
      await diamondLoupeFacet.facetAddress('0x01ffc9a7')
    )
    assert.equal(
      addresses[2],
      await diamondLoupeFacet.facetAddress('0xf2fde38b')
    )
  })

  
  
it('Should fail: check if Ezra facet is available', async () => {
    const Ezra = await ethers.getContractAt('Ezra', diamondAddress);
    
    let errorOccurred = false;
    try {
        await Ezra.ezra1();
    } catch (error) {
        errorOccurred = true;
    }
    
    assert(errorOccurred, "Expected function call to fail but it succeeded.");
});

  
 

  it('should add the facet Ezra and its functions', async () => {
    const Ezra = await ethers.getContractFactory('Ezra')
    const ezra = await Ezra.deploy()
    await ezra.deployed()
    addresses.push(ezra.address)
    const selectors = getSelectors(ezra).remove(['ezra4']);
    tx = await diamondCutFacet.diamondCut(
      [{
        facetAddress: ezra.address,
        action: FacetCutAction.Add,
        functionSelectors: selectors
      }],
      ethers.constants.AddressZero, '0x', { gasLimit: 800000 })
    receipt = await tx.wait()
    if (!receipt.status) {
      throw Error(`Diamond upgrade failed: ${tx.hash}`)
    }
    result = await diamondLoupeFacet.facetFunctionSelectors(ezra.address)
    assert.sameMembers(result, selectors)
    assert.equal(ezra.address, addresses[3]);
 
  })
  it('check if Ezra facet is available', async () => {
    const Ezra = await ethers.getContractAt('Ezra', diamondAddress)
    await Ezra.ezra1();
  })
   

  it('should test ezra function call', async () => {
    const ezra = await ethers.getContractAt('Ezra', diamondAddress)
    await ezra.ezra5()
  })
  it('should have four facets', async () => {
    assert.equal(addresses.length, 4)
  })

  

  it('should replace ezra5 function', async () => {
  const Ezra = await ethers.getContractFactory('Ezra');
  
  const ezra = await Ezra.deploy();
  await ezra.deployed();
  
  const selectors = getSelectors(Ezra).get(['ezra5']);
  
  const ezraAddress = ezra.address;
  addresses[4] = ezra.address;
  
  tx = await diamondCutFacet.diamondCut(
    [{
      facetAddress: addresses[4],
      action: FacetCutAction.Replace,
      functionSelectors: selectors
    }],
    ethers.constants.AddressZero, '0x', { gasLimit: 800000 }
  );
  
  receipt = await tx.wait();
  if (!receipt.status) {
    throw Error(`Diamond upgrade failed: ${tx.hash}`);
  }
  
  result = await diamondLoupeFacet.facetFunctionSelectors(ezraAddress);
  assert.sameMembers(result, selectors);
  assert.equal(addresses[4], ezraAddress);
});
 
  it('Should fail: check if ezra4() function is available', async () => {
    const Ezra = await ethers.getContractAt('Ezra', diamondAddress);
    
    let errorOccurred = false;
    try {
        await Ezra.ezra4();
    } catch (error) {
        errorOccurred = true;
    }
    
    assert(errorOccurred, "Expected function call to fail but it succeeded.");
});
  
it('should add ezra4 function', async () => {
  const Ezra = await ethers.getContractFactory('Ezra');
  
  const ezra = await Ezra.deploy();
  await ezra.deployed();
  
  const selectors = getSelectors(Ezra).get(['ezra4']);
  
  const ezraAddress = ezra.address;
  addresses[4] = ezra.address;
  
  tx = await diamondCutFacet.diamondCut(
    [{
      facetAddress: addresses[4],
      action: FacetCutAction.Add,
      functionSelectors: selectors
    }],
    ethers.constants.AddressZero, '0x', { gasLimit: 800000 }
  );
  
  receipt = await tx.wait();
  if (!receipt.status) {
    throw Error(`Diamond upgrade failed: ${tx.hash}`);
  }
  
  result = await diamondLoupeFacet.facetFunctionSelectors(ezraAddress);
  assert.sameMembers(result, selectors);
  assert.equal(addresses[4], ezraAddress);
});
  it('check if ezra4() can be called before', async () => {
    const Ezra = await ethers.getContractAt('Ezra', diamondAddress)
    await Ezra.ezra4()
  })

  it('should remove some ezra4 functions', async () => {
    const test1Facet = await ethers.getContractAt('Ezra', diamondAddress)
    const functionsToKeep = ['ezra4()']
    const selectors = getSelectors(test1Facet).remove(functionsToKeep)
    tx = await diamondCutFacet.diamondCut(
      [{
        facetAddress: ethers.constants.AddressZero,
        action: FacetCutAction.Remove,
        functionSelectors: selectors
      }],
      ethers.constants.AddressZero, '0x', { gasLimit: 800000 })
    receipt = await tx.wait()
    if (!receipt.status) {
      throw Error(`Diamond upgrade failed: ${tx.hash}`)
    }
    result = await diamondLoupeFacet.facetFunctionSelectors(addresses[4])
    assert.sameMembers(result, getSelectors(test1Facet).get(functionsToKeep))
  })
  
  it('Should fail: check if ezra1() function is available', async () => {
    const Ezra = await ethers.getContractAt('Ezra', diamondAddress);
    
    let errorOccurred = false;
    try {
        await Ezra.ezra1();
    } catch (error) {
        errorOccurred = true;
    }
    
    assert(errorOccurred, "Expected function call to fail but it succeeded.");
});
  
  

  
})
