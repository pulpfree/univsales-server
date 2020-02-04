/* cSpell:disable */
// to test, use: yarn test:w ./src/authorizer

import validator from './validator'

const expiredToken = 'eyJraWQiOiJiT0M3eWRkS2hleXZGVnp3VlNsczVPd1JTbENySHF3TzA3RHlGUVBiMk9JPSIsImFsZyI6IlJTMjU2In0.eyJzdWIiOiI4MDYzNjY0Mi0zZTcxLTRjNTctOWQ2MS02YmYwNzFiYjg5ZTEiLCJjb2duaXRvOmdyb3VwcyI6WyJhZG1pbiJdLCJ0b2tlbl91c2UiOiJhY2Nlc3MiLCJzY29wZSI6ImF3cy5jb2duaXRvLnNpZ25pbi51c2VyLmFkbWluIiwiYXV0aF90aW1lIjoxNTYwOTY3NDg1LCJpc3MiOiJodHRwczpcL1wvY29nbml0by1pZHAuY2EtY2VudHJhbC0xLmFtYXpvbmF3cy5jb21cL2NhLWNlbnRyYWwtMV8xRFFqblU2amQiLCJleHAiOjE1NjEwNDMwNjYsImlhdCI6MTU2MTAzOTQ2NiwianRpIjoiY2I4ODI4MmUtMzE3OC00ZGJiLWJlOGEtYmNkYzJiYTliNDI3IiwiY2xpZW50X2lkIjoiMjA3NWtiYmJiM2hhZG10YWxlZGNuY2ZiazAiLCJ1c2VybmFtZSI6InB1bHBmcmVlIn0.f-PmXyLsfC0sX9t4Oj7AyZmlGjX0J2crCM1wfEQ_AcuWniW9y_QUGrrWdefWjcSXpsvNUg-ZjMPmTyHKuVlsi9B44fbpg_nX1oZODgzXqP_IeoJ0TwvXU1eWVOG-CGO6ktaRYn1WqNQqr1XIoV5BoDapYQjO64kYdmaK3_6Xz9QBi4PrZ3TCzA8tlNik5zZcsy1VAzlCqyuNPTu662R8228I65f48pJr1FoZbTQk7bFIp9CiPl6cJLRCALNcaI2AbWquqpY_nWUOMClfppeoz3rE0u3pa_PBNRVAoO1PIpU_SRdaw1DmxagFLz5XSr5uFv0TV0jlGkLs_wWo92Ek3Q'
// note: require a fresh token here to properly test
const token = 'eyJraWQiOiJiT0M3eWRkS2hleXZGVnp3VlNsczVPd1JTbENySHF3TzA3RHlGUVBiMk9JPSIsImFsZyI6IlJTMjU2In0.eyJzdWIiOiI4MDYzNjY0Mi0zZTcxLTRjNTctOWQ2MS02YmYwNzFiYjg5ZTEiLCJjb2duaXRvOmdyb3VwcyI6WyJhZG1pbiJdLCJ0b2tlbl91c2UiOiJhY2Nlc3MiLCJzY29wZSI6ImF3cy5jb2duaXRvLnNpZ25pbi51c2VyLmFkbWluIiwiYXV0aF90aW1lIjoxNTYwOTY3NDg1LCJpc3MiOiJodHRwczpcL1wvY29nbml0by1pZHAuY2EtY2VudHJhbC0xLmFtYXpvbmF3cy5jb21cL2NhLWNlbnRyYWwtMV8xRFFqblU2amQiLCJleHAiOjE1NjEwNjc0MzksImlhdCI6MTU2MTA2MzgzOSwianRpIjoiNDE2NGYzNjMtNjRiOS00NDE5LWI5ZjYtNDlmNjgzYmRhNGY4IiwiY2xpZW50X2lkIjoiMjA3NWtiYmJiM2hhZG10YWxlZGNuY2ZiazAiLCJ1c2VybmFtZSI6InB1bHBmcmVlIn0.Xfgg-wJdKr6MtLdaqW1ez5yUnkklilvWOz_GnDWpxEEYnl7Ib3ej01vhFbkqZUFYW9YCCKSnvjQePnjcu7J8pnmI3sVBTXIFcPBdJ07KjwCFF0G7PTCv09ts6haH7BtUExRligJuyiqh1L3mWy_gh94980aSLr7MCwZcMiZi8BfuhlkeFqTp12YaLbpVIiTxQFze5xw_U539EReQRgxoK6cvPvDPCeCZimLeJ1mxWubnZak1u_6t3VvuIHCEMydGmFROBBs10-jKnUlooKGZPJvhg8TQKduMBQVFcKDt3QcF5LMbXdQWlHcfZoEyKApuvXaHl-RwE1KTabi0mPMp_Q'
const clientID = '2075kbbbb3hadmtaledcncfbk0'
const invalidClientID = '2075kbbbb3hadmtaledcncfbk9'


test('authCheck expired token', async () => {
  const res = await validator(clientID, expiredToken)
  expect(res.status).toEqual('unauthorized')
})

test('authCheck invalid clientID', async () => {
  const res = await validator(invalidClientID, token)
  expect(res.status).toEqual('deny')
})

test('authCheck allow', async () => {
  const res = await validator(clientID, token)
  expect(res.status).toEqual('allow')
})