import json
import os


from rest_framework import viewsets, generics, permissions
from rest_framework.decorators import api_view
from rest_framework.permissions import AllowAny
from rest_framework.status import HTTP_201_CREATED, HTTP_400_BAD_REQUEST
from rest_framework.response import Response
from .models import User, Sites
from .serializers import UserSerializer
import os
from rest_framework import viewsets, generics, permissions
from .models import Grupos, User, Sites
from .serializers import SitesSerializer
from rest_framework.views import APIView
from rest_framework.decorators import authentication_classes, permission_classes


class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer

    permission_classes = [
        permissions.AllowAny  # Or anon users can't register
    ]

    def has_perm(self, perm, obj=None):
        "Does the user have a specific permission?"
        # Simplest possible answer: Yes, always
        return True

    def has_module_perms(self, app_label):
        "Does the user have permissions to view the app `app_label`?"
        # Simplest possible answer: Yes, always
        return True

    @property
    def is_staff(self):
        "Is the user a member of staff?"
        # Simplest possible answer: All admins are staff
        return self.is_admin

    @api_view(['POST'])
    def create_auth(request):
        serialized = UserSerializer(data=request.DATA)
        if serialized.is_valid():
            User.objects.create_user(
                serialized.init_data['email'],
                serialized.init_data['password']
            )
            return Response(serialized.data, status=HTTP_201_CREATED)
        else:
            return Response(serialized._errors, status=HTTP_400_BAD_REQUEST)


@permission_classes((AllowAny,))
@authentication_classes([])
class BlockUrl(APIView):
    permission_classes = [
        permissions.AllowAny  # Or anon users can't register
    ]

    # queryset = Sites.objects.all()
    # serializer_class = SitesSerializer

    def check_if_profile_proxy_config_exists(self):
        http_proxy = 'export http_proxy=http://192.168.1.186:3128'
        https_proxy = 'export https_proxy=http://192.168.1.186:3128'

        try:
            with open("/etc/profile", "r") as f:
                etc_profile_read = f.read()
                print(etc_profile_read)
        except ValueError:
            print(ValueError)
        try:
            if not http_proxy in etc_profile_read:
                open("/etc/profile", "a+").write("\n" + http_proxy)
            if not https_proxy in etc_profile_read:
                open("/etc/profile", "a+").write("\n" + https_proxy)
            # open("/etc/profile", "a+").close()
        except ValueError:
            print("An error has occurred opening the file ")
            print(ValueError)

    def check_if_profile_squid_config_exists(self):
        maximum_object_size = 'maximum_object_size 120 MB'
        minimum_object_size = 'minimum_object_size 0 KB'
        cache_mem = 'cache_mem 256 MB'
        http_access_localhost = 'http_access allow localhost'

        word_to_block = 'globo'  # This word will come from React.

        proxy_ip = 'acl liberarip src 192.168.1.186'
        name_to_block = 'acl {} url_regex -i {}'.format(word_to_block, word_to_block)
        http_access_deny = 'http_access deny {}'.format(word_to_block)
        liberarip = 'http_access allow liberarip'
        deny_all = 'http_access deny all'

        try:
            # read the current contents of the file
            f = open('/etc/squid/squid.conf')
            backup = f.read()
            f.close()

            # open the file again for writing
            f = open('/etc/squid/squid.conf', 'w')

            append_values = ''

            if not maximum_object_size in backup:
                append_values += maximum_object_size + '\n'
            if not minimum_object_size in backup:
                append_values += minimum_object_size + '\n'
            if not cache_mem in backup:
                append_values += cache_mem + '\n'
            if not http_access_localhost in backup:
                append_values += http_access_localhost + '\n'
            if not proxy_ip in backup:
                append_values += proxy_ip + '\n'
            if not name_to_block in backup:
                append_values += name_to_block + '\n'
            if not http_access_deny in backup:
                append_values += http_access_deny + '\n'
            if not liberarip in backup:
                append_values += liberarip + '\n'
                append_values += deny_all + '\n'

            f.write(append_values)  # + "\n"
            # write the original contents
            backup = backup.rstrip("\n")
            f.write(backup)
            f.close()
        except ValueError:
            print("An error has occurred opening the file ")
            print(ValueError)

        return Response("O site " + word_to_block + "foi adiconado a blacklist com sucesso.")

    def get(self, request):
        # json_response = "www.youtube.com.br"
        # site_to_block = "acl block {}".format(json_response)
        print("get")
        os.system("sudo chmod 777 /etc/squid")
        os.system("sudo chmod 777 /etc/profile")
        # os.system("sudo chmod 777 /etc/squid/squid.conf")
        # os.system("sudo chmod 777 /etc/profile")

        self.check_if_profile_proxy_config_exists()
        self.check_if_profile_squid_config_exists()

        # os.system("sudo systemctl reload squid.service")
        os.system("sudo systemctl reload squid")
        # os.system("sudo squid -k reconfigure")

        return Response("O site foi adiconado a blacklist com sucesso.")


@permission_classes((AllowAny,))
@authentication_classes([])
class RemoveUrl(APIView):
    def remove_url_blocked_squid(self):
        bad_words = "globo"
        import re
        import fileinput

        my_regex = r"\b" + re.escape(bad_words) + r"\b"

        try:
            for line in fileinput.input(r'/etc/squid/squid.conf', inplace=True):
                if not re.search(my_regex, line):
                    line = line.rstrip("\n")
                    print(line)
        except ValueError:
            return Response(ValueError)

    def get(self, request):
        os.system("sudo chmod 777 /etc/squid")
        self.remove_url_blocked_squid()
        os.system("sudo systemctl reload squid")

        return Response("O site foi removido da blacklist com sucesso.")
