import json
import requests



from .hal_rest import Resource, HAL_REST


class UserREST(HAL_REST):
    """Helper class for accessing Mixergy REST API
    """
    
    def __init__(self, host='www.mixergy.io', server_hostname=None, username=None, password=None, verify=None, logout_on_exit=True):
        """Create object, log in if credentials are supplied

        Parameters
        ----------
        host : string
            Machine hosting REST API
        username : string
            Username (email address)
        password : string
            User's password
        logout_on_exit : boolean
            When used as a context manager, indicates whether this object should log out on exit
        """
        super().__init__(host, server_hostname=server_hostname, verify=verify)

        self.__logout_on_exit = False

        if username is not None:
            self.login(username, password, logout_on_exit=logout_on_exit)


    def __exit__(self, *exc_info):
        if self.__logout_on_exit:
            self.logout()
        super().__exit__(*exc_info)



    def get_token(self):
        """Get the current authentication token

        Returns
        -------
        string
            The current authentication token. These are created by a login request

        """
        return self.__token



    def set_token(self, token):
        """Set the current authentication token

        Parameters
        ----------
        token : string
            Set the current login token. Usually obtained by a login request performed by a previous instance of this class. 
        """
        self.__token = token
        self._set_header('Authorization', 'Bearer ' + token)



    def logout(self):
        self.delete_hal('account', 'login')
        self.__logout_on_exit = False


    def logout_on_exit(self, logout_on_exit):
        self.__logout_on_exit = logout_on_exit



    def login(self, username, password, logout_on_exit=True):
        r = self.post_hal('account', 'login', json={'username': username,'password': password})

        self.__logout_on_exit = logout_on_exit
    
        token = r.json()['token']

        self.set_token(token)

        if token is None:
            raise RuntimeError('Login token not available')

        return r



    def get_controllers(self):
        """Get the controllers visible to the user

        Return
        ------
        dictionary
            Get the user's controllers as a dictionary. The key is the serial number, the value is the controller.
        """
        controllers = self.get_hal_resource('controllers').get_list('controllerList')

        if controllers is not None:
            return { controller['serialNumber']: Resource(controller) for controller in controllers }


    def get_controller(self, controller):
        if not isinstance(controller, Resource):
            controllers = self.get_controllers()
            controller = controllers[controller]

        return self.get_hal_resource(controller)


    def get_device(self, controller_or_device, unit=None):
        if unit is None:
            # Assume it's a device
            return self.get_hal_resource(controller_or_device)
        else:
            # Assume it's a controller
            devices = controller_or_device.get_list('deviceList')

            for device in devices:
                if device['unit'] == unit:
                    return self.get_hal_resource(Resource(device))


    def get_zones(self, zone_group):
        return self.get_hal_resource(zone_group, 'zones').get_list("zoneList")

    def get_zone_devices(self, zone):
        return self.get_hal_resource(zone, 'zoneDevices').get_list("zoneDevicesList")

    def get_tanks(self):
        """Get the tanks visible to the user

        Return
        ------
        dictionary
            Get the user's tanks as a dictionary. The key is the tank serial number, the value is the Tank object.
        """
        tanks = self.get_hal_resource('tanks').get_list('tankList')

        if tanks is not None:
            return { tank['serialNumber']: Resource(tank) for tank in tanks }


    def get_tank(self, tank):
        """Get the tanks visible to the user

        Parameters
        ----------
        tank : string|Tank
            If this is a Tank object fetch the HAL resource for the tank. If this is a string, fetch all tanks and extract the Tank object before fetching the HAL resource.

        Return
        ----------
        Tank
            Get the user's tanks as a dictionary. The key is the tank serial number. 
        """
        if not isinstance(tank, Resource):
            tanks = self.get_tanks()
            tank = tanks[tank]

        return self.get_hal_resource(tank)


    def get_device_settings(self, device):
        """Get the tank's settings

        Parameters
        ----------
        tank : Tank
            The tank to fetch settings for

        Return
        ----------
        Object
            Get the tank's settings as a Python object
        """
        self.__check(device)

        return self.get_hal_json(device, 'settings')


    def put_device_settings(self, device, settings):
        """Put the tank's settings

        Parameters
        ----------
        tank : Tank
            The tank to set settings for
        settings : dictionary
            Tank settings as a dictionary


        Return
        ----------
        Object
            The response to the request 
        """
        self.__check(device)

        return self.put_hal(device, 'settings', json=settings)

    def put_device_control(self, device, control):
        """Control the device
        """
        self.__check(device)

        return self.put_hal(device, 'control', json=control)


    def get_tank_analysis(self, tank):
        """Get the tank's settings"""
        self.__check(tank)

        return self.get_hal_json(tank, 'analysis')


    def put_tank_analysis(self, tank, analysis):
        """Put the analysis about the tank"""
        self.__check(tank)

        return self.put_hal(tank, 'analysis', json=analysis)


    # 2**42 == Year 2109
    def get_device_events(self, device, start=0, end=2**42):
        """Get the tank's events

        Parameters
        ----------
        tank : Tank
            The tank to get events for
        start : int
            The fetch start time in milliseconds
        end : int
            The fetch end time in milliseconds

        Return
        ----------
        Object
            Event data
        """
        self.__check(device)

        params = { 'range': f'{start}:{end}' }

        return self.get_hal_json(device, 'events', params=params)


    def get_device_earliest_event(self, device):
        """Get the tank's earliest event

        Parameters
        ----------
        tank : Tank
            The tank to get the earliest event for

        Return
        ----------
        Object
            Event data
        """
        self.__check(device)
        return self.get_hal_json(device, 'earliest_event')


    def get_device_latest_event(self, device):
        """Get the tank's latest event

        Parameters
        ----------
        tank : Tank
            The tank to get the latest event for

        Return
        ----------
        Object
            Event data
        """
        self.__check(device)

        return self.get_hal_json(device, 'latest_event')


    # 2**42 == Year 2109
    def get_device_measurements(self, device, start=0, end=2**42):
        """Get the tank's measurements

        Parameters
        ----------
        tank : Tank
            The tank to get the measurements for
        start : int
            The fetch start time in milliseconds
        end : int
            The fetch end time in milliseconds

        Return
        ----------
        Object
            Measurement data
        """
        self.__check(device)

        params = { 'range': f'{start}:{end}' }

        return self.get_hal_json(device, 'measurements', params=params)


    def get_device_earliest_measurement(self, device):
        """Get the tank's earliest measurement

        Parameters
        ----------
        tank : Tank
            The tank to get the earliest measurement for

        Return
        ----------
        Object
            Measurement data
        """
        self.__check(device)
        return self.get_hal_json(device, 'earliest_measurement')


    def get_device_latest_measurement(self, device):
        """Get the tank's latest measurement

        Parameters
        ----------
        tank : Tank
            The tank to get the latest measurement for

        Return
        ----------
        Object
            Measurement data
        """
        self.__check(device)

        return self.get_hal_json(device, 'latest_measurement')


    def get_device_schedule(self, tank):
        """Get the tank's schedule

        Parameters
        ----------
        tank : Tank
            The tank to get the schedule for


        Return
        ----------
        Object
            Get the device's schedule as a Python object 
        """
        self.__check(tank)
        return self.get_hal_json(tank, 'schedule')

 
    def put_device_schedule(self, device, schedule):
        self.__check(device)
        return self.put_hal(device, 'schedule', json=schedule)

 
    def get_tank_auto_schedule(self, tank):
        self.__check(tank)
        return self.get_hal_json(tank, 'autoschedule')
 
 
    def put_tank_auto_schedule(self, tank, schedule):
        self.__check(tank)
        return self.put_hal(tank, 'autoschedule', json=schedule)


    def get_tank_tariff(self, tank):
        self.__check(tank)
        return self.get_hal_json(tank, 'tariff')


    def put_tank_tariff(self, tank, tariff):
        self.__check(tank)
        return self.put_hal(tank, 'tariff', json=tariff)


    def get_tank_tariff_service_request(self, tank):
        self.__check(tank)
        return self.get_hal_json(tank, 'tariff_service_request')


    def put_tank_tariff_service_request(self, tank, tariff_request):
        self.__check(tank)
        return self.put_hal(tank, 'tariff_service_request', json=tariff_request)


    def get_controller_config(self, controller):
        self.__check(controller)
        return self.get_hal_json(controller, 'configuration')
 

    def put_controller_config(self, controller, config):
        self.__check(controller)
        return self.put_hal(controller, 'configuration', json=config)

 
    def put_tank_control(self, tank, control):
        """Get the tank's settings

        Parameters
        ----------
        tank : Tank
            The tank for which to fetch the settings.


        Return
        ----------
        Object
            Get the tank's as a Python object. 
        """
        self.__check(tank)
        return self.put_hal(tank, 'control', json=control)


    def get_tank_commission_record(self, tank):
        self.__check(tank)

        return self.get_hal_json(tank, 'commission')


    def create_tank_commission_record(self, tank, payload = None):
        self.__check(tank)

        return Resource(self.post_hal(tank, 'commission', json=payload).json())



    def get_portfolios(self):
        resource = self.get_hal_resource('portfolios')
        if resource is not None:
            portfolios = resource.get_list('portfolioList')

            if portfolios is not None:
                return { portfolio['portfolioName']: Resource(portfolio) for portfolio in portfolios }


    def get_portfolio(self, portfolio):
        if not isinstance(portfolio, Resource):
            portfolios = self.get_portfolios()
            portfolio = portfolios[portfolio]

        return self.get_hal_resource(portfolio)


    def get_portfolio_analyses(self, portfolio):
        self.__check(portfolio)

        return self.get_hal_json(portfolio, "analyses")



    def get_portfolio_tanks(self, portfolio):
        self.__check(portfolio)

        tanks = self.get_hal_resource(portfolio, 'tanks').get_list('tankList')

        if tanks is not None:
            return { tank['serialNumber']: Resource(tank) for tank in tanks }



    def create_portfolio(self, name, description, identifier):
        payload = {'portfolioName': name, 'portfolioDescription': description, 'portfolioId': identifier}
        return self.post_hal('portfolios', json=payload)



    def delete_portfolio(self, name):
        portfolios = self.get_portfolios()
        payload = {'name': name}
        return self.delete_hal_target(portfolios[name])



    def portfolio_add_user(self, portfolio, username, role):
        self.__check(portfolio)
        payload = {'username':username, 'role': role}
        return self.post_hal(portfolio, 'users', json=payload)



    def portfolio_add_tank(self, portfolio, tankId):
        self.__check(portfolio)
        payload = {'tankIdentifier':tankId}
        return self.post_hal(portfolio, 'tanks', json=payload)


    def get_portfolio_measurements(self, portfolio, start=0, end=2**42):
        self.__check(portfolio)

        params = { 'range' : f'{start}:{end}' }

        return self.get_hal_json(portfolio, 'measurements', params=params)



    def get_system_settings(self):
        settings = self.get_hal_resource('system', 'settings').get_list('settingList')

        return { setting['name']: Resource(setting) for setting in settings }


    def get_system_setting(self, setting):
        self.__check(setting)
        return self.get_hal_json(setting)



    def put_system_setting(self, setting, json=None, data=None):
        self.__check(setting)
        return self.put_hal(setting, json=json, data=data)


    def get_users_me(self):
        return Resource(self.get_hal_resource('users', 'me'))


    def get_anomalies(self, start=0, end=2**42):
        params = { 'range' : f'{start}:{end}' }

        return self.get_hal_resource('data', 'anomalies', params=params)


    def associate_tank(self, user, id, asc=None):
        self.__check(user)
        settings = {'tankIdentifier': id}
        if asc is not None:
            settings['automatic_schedule_control'] = asc
        return  self.post_hal(user, 'tanks', json=settings)


    def create_user(self, account_data):
        return self.post_hal('account', json=account_data)


    def post_validate(self, payload):
        return self.post_hal('account', 'validation', json=payload)


    def put_validate(self, payload):
        return self.put_hal('account', 'validation', json=payload)


    def delete_firmware(self, firmware):
        r = self.delete_hal(firmware)
        r.raise_for_status()
        return r


    def get_firmwares(self):
        firmwares = self.get_hal_resource('firmware').get_list('firmwareList')

        return { firmware['uuid']: Resource(firmware) for firmware in firmwares }


    def post_firmware(self, data):
        r = self.post_hal('firmware', files=data)
        r.raise_for_status()
        return r


    def put_set_firmware_version(self, ids, version):
        payload = {'firmwareVersion': version, 'ids' : ids}
        return self.put_hal('controllers', 'firmware', json=payload)


    def put_change_password(self, user, password, new_password):
        self.__check(user)
        payload = {'oldPassword': password, 'newPassword': new_password}
        return self.put_hal(user, 'password', json=payload)


    def post_password_reset(self, username):
        payload = {'username': username}
        return self.post_hal('account', 'passwordreset', json=payload)

    
    def put_password_reset(self, code, password):
        payload = { 'code' : code, 'newPassword': password }
        return self.put_hal('account', 'passwordreset', json=payload)


    def get_users(self):
        users = self.get_hal_resource('users').get_list('userList')

        if users is not None:
            return { user['username']: Resource(user) for user in users }


    def get_user(self, user):
        if not isinstance(user, Resource):
            users = self.get_users()
            user = users[user]

        return Resource(self.get_hal_resource(user, 'self'))

    def delete_user(self, user):
        self.__check(user)
        return self.delete_hal(user)

    def put_user(self, user, misc_data):
        self.__check(user)
        return self.put_hal(user, json=misc_data)


    def get_user_tanks(self, user):
        self.__check(user)

        tanks = self.get_hal_resource(user, 'tanks').get_list('tankList')

        if tanks is not None:
            return { tank['serialNumber']: Resource(tank) for tank in tanks }


    @classmethod
    def __check(cls, resource):
        if not isinstance(resource, Resource):
            raise RuntimeError(f'resource ({resource}) is not a resource')
