import { Query, Mutation } from 'react-apollo';
import gql from 'graphql-tag';

import ErrorMessage from './ErrorMessage';
import Table from './styles/Table';
import SickButton from './styles/SickButton';

const possiblePermissions = [
  'ADMIN',
  'USER',
  'ITEMCREATE',
  'ITEMUPDATE',
  'ITEMDELETE',
  'PERMISSIONUPDATE',
];

const UPDATE_PERMISSIONS_MUTATION = gql`
  mutation UPDATE_PERMISSIONS_MUTATION($permissions: [Permission], $userId: ID!) {
    updatePermissions(permissions: $permissions, userId: $userId) {
      id
      permissions
      name
      email
    }
  }
`;

const ALL_USERS_QUERY = gql`
  query ALL_USERS_QUERY {
    users {
      id
      name
      email
      permissions
    }
  }
`;

const Permissions = props => (
  <Query query={ALL_USERS_QUERY}>
    {({ data, loading, error }) => (
      <div>
        <ErrorMessage error={error} />
        <div>
          <h2>Manage Permissions</h2>
          <Table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                {possiblePermissions.map(permission => (
                  <th key={permission}>{permission}</th>
                ))}
                <th>👇🏼</th>
              </tr>
            </thead>
            <tbody>
              {data.users.map(user => (
                <UserPermissions key={user.id} user={user} />
              ))}
            </tbody>
          </Table>
        </div>
      </div>
    )}
  </Query>
);

class UserPermissions extends React.Component {
  state = {
    permissions: this.props.user.permissions,
  };

  handlePermissionChange = (event, updatePermissionsMutation) => {
    const checkbox = event.target;
    let updatedPermissions = [...this.state.permissions];

    if (checkbox.checked) {
      updatedPermissions.push(checkbox.value);
    } else {
      updatedPermissions = updatedPermissions.filter(permission => permission !== checkbox.value);
    }

    // it will execute de mutation after update de state
    this.setState({ permissions: updatedPermissions }, updatePermissionsMutation);
  };

  render() {
    const user = this.props.user;

    return (
      <Mutation
        mutation={UPDATE_PERMISSIONS_MUTATION}
        variables={{
          permissions: this.state.permissions,
          userId: user.id,
        }}>
        {(updatePermissions, { loading, error }) => (
          <>
            {error && (
              <tr>
                <td colSpan='8'>
                  <ErrorMessage error={error} />
                </td>
              </tr>
            )}
            <tr>
              <td style={{ fontSize: '12px' }}>{user.name}</td>
              <td style={{ fontSize: '12px' }}>{user.email}</td>
              {possiblePermissions.map(permission => (
                <td key={permission} style={{ textAlign: 'center' }}>
                  <label htmlFor={`${user.id}-permission-${permission}`}>
                    <input
                      id={`${user.id}-permission-${permission}`}
                      type='checkbox'
                      value={permission}
                      checked={this.state.permissions.includes(permission)}
                      onChange={e => this.handlePermissionChange(e, updatePermissions)}
                    />
                  </label>
                </td>
              ))}
              <td>
                <SickButton type='button' disabled={loading} onClick={updatePermissions}>
                  Updat{loading ? 'ing' : 'e'}
                </SickButton>
              </td>
            </tr>
          </>
        )}
      </Mutation>
    );
  }
}

export default Permissions;
