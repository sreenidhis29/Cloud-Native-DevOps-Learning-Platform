from app import create_app
from app.models import db
from app.models.models import Topic, Question

def seed_data():
    # Clear existing data to avoid duplicates
    db.session.query(Question).delete()
    db.session.query(Topic).delete()

    # 1. Mission: CrashLoop Backoff Emergency
    crashloop_mission = Topic(
        name='Operation: CrashLoop Backoff',
        description='A critical microservice is stuck in a restart loop. The error log shows "OOMKilled". You must stabilize the system before the whole cluster crashes.',
        slug='crashloop-backoff'
    )

    # 2. Mission: The Ingress Blackout
    ingress_mission = Topic(
        name='Incident: The 502 Blackout',
        description='Traffic is being dropped at the edge. The ALB Ingress Controller is reporting 502 Bad Gateway errors. Trace the route and fix the upstream connection.',
        slug='ingress-502'
    )

    # 3. Mission: Database Connection Crisis
    db_mission = Topic(
        name='Mission: Vault Leakage',
        description='The backend has lost its connection to the RDS instance after a secret rotation. The production database is unreachable. Restore the connection string immediately.',
        slug='db-connection'
    )

    # Questions for CrashLoop (10 total)
    crashloop_questions = [
        Question(topic=crashloop_mission, question_text='The pod status is "OOMKilled". What is the first corrective action?', options=['Increase memory limits', 'Decrease replicas', 'Change base image', 'Disable probes'], correct_answer=0),
        Question(topic=crashloop_mission, question_text='Which command shows logs from the PREVIOUS container instance?', options=['kubectl logs <pod>', 'kubectl describe pod', 'kubectl logs <pod> --previous', 'kubectl get events'], correct_answer=2),
        Question(topic=crashloop_mission, question_text='What is the status when a container exits immediately after starting repeatedly?', options=['CrashLoopBackOff', 'ImagePullBackOff', 'Pending', 'Running'], correct_answer=0),
        Question(topic=crashloop_mission, question_text='Which field in a Deployment ensures pods are not killed too quickly during updates?', options=['terminationGracePeriodSeconds', 'minReadySeconds', 'maxSurge', 'maxUnavailable'], correct_answer=1),
        Question(topic=crashloop_mission, question_text='A pod is "Pending". What should you check first?', options=['kubectl logs', 'kubectl describe pod', 'kubectl get nodes', 'The Dockerfile'], correct_answer=1),
        Question(topic=crashloop_mission, question_text='Which probe determines if a container needs to be restarted?', options=['ReadinessProbe', 'LivenessProbe', 'StartupProbe', 'SecurityProbe'], correct_answer=1),
        Question(topic=crashloop_mission, question_text='If a pod is stuck in "ContainerCreating", which resource is likely missing?', options=['ConfigMap/Secret', 'Service', 'Ingress', 'HPA'], correct_answer=0),
        Question(topic=crashloop_mission, question_text='What does "Exit Code 137" typically indicate?', options=['Clean exit', 'Segmentation fault', 'OOMKilled / SIGKILL', 'Permission denied'], correct_answer=2),
        Question(topic=crashloop_mission, question_text='Which K8s resource manages scaling based on CPU usage?', options=['Deployment', 'HPA', 'VPA', 'Cluster Autoscaler'], correct_answer=1),
        Question(topic=crashloop_mission, question_text='What is the default "restartPolicy" for a Deployment?', options=['OnFailure', 'Never', 'Always', 'OnlyOnCrash'], correct_answer=2)
    ]

    # Questions for Ingress (10 total)
    ingress_questions = [
        Question(topic=ingress_mission, question_text='A 502 Bad Gateway usually means:', options=['Ingress cannot find Backend', 'SSL is expired', 'DB is down', 'Browser error'], correct_answer=0),
        Question(topic=ingress_mission, question_text='Which annotation tells ALB to use "IP" target type?', options=['alb.ingress.kubernetes.io/target-type: ip', 'alb.ingress.kubernetes.io/scheme', 'kubernetes.io/ingress.class', 'service.beta.kubernetes.io/aws-load-balancer-type'], correct_answer=0),
        Question(topic=ingress_mission, question_text='Where do you define path-based routing in K8s?', options=['Service', 'ConfigMap', 'Ingress Spec', 'Deployment'], correct_answer=2),
        Question(topic=ingress_mission, question_text='Which component is responsible for creating the AWS ALB?', options=['CoreDNS', 'Kube-proxy', 'AWS Load Balancer Controller', 'VPC CNI'], correct_answer=2),
        Question(topic=ingress_mission, question_text='A 504 Gateway Timeout suggests:', options=['SSL Error', 'Backend took too long to respond', 'Invalid path', 'Authentication failure'], correct_answer=1),
        Question(topic=ingress_mission, question_text='What K8s resource does an Ingress route traffic to?', options=['Pod', 'Service', 'Deployment', 'ReplicaSet'], correct_answer=1),
        Question(topic=ingress_mission, question_text='Which port does the ALB controller usually listen on for HTTPS?', options=['80', '443', '8080', '22'], correct_answer=1),
        Question(topic=ingress_mission, question_text='How do you specify multiple hostnames in one Ingress?', options=['Multiple Ingress objects', 'Using "rules" list', 'Using "annotations"', 'It is not possible'], correct_answer=1),
        Question(topic=ingress_mission, question_text='What does "Sticky Sessions" ensure in an ALB?', options=['User stays on same pod', 'User is redirected to HTTPS', 'User gets cached content', 'User session is encrypted'], correct_answer=0),
        Question(topic=ingress_mission, question_text='Which tool helps manage SSL certificates for Ingress?', options=['External-DNS', 'Cert-Manager', 'Prometheus', 'Helm'], correct_answer=1)
    ]

    # Questions for DB (10 total)
    db_questions = [
        Question(topic=db_mission, question_text='Backend reports "authentication failed". Check:', options=['DB is down', 'Secret sync', 'VPC Peering', 'Image corruption'], correct_answer=1),
        Question(topic=db_mission, question_text='Which tool tests DB connectivity from a pod?', options=['ping', 'telnet', 'psql', 'curl'], correct_answer=2),
        Question(topic=db_mission, question_text='What is an "ExternalName" service type used for?', options=['Expose pod to internet', 'Alias for external DNS (RDS)', 'Load balancer', 'Internal service discovery'], correct_answer=1),
        Question(topic=db_mission, question_text='Which AWS service provides managed PostgreSQL?', options=['DynamoDB', 'RDS', 'Redshift', 'S3'], correct_answer=1),
        Question(topic=db_mission, question_text='How should you store a DB password in K8s?', options=['ConfigMap', 'Environment variable', 'Secret', 'Hardcoded in code'], correct_answer=2),
        Question(topic=db_mission, question_text='Which port does PostgreSQL use by default?', options=['3306', '6379', '5432', '27017'], correct_answer=2),
        Question(topic=db_mission, question_text='A "Connection Timeout" to RDS usually means:', options=['Wrong password', 'Security Group / Network issue', 'DB is full', 'Invalid SQL'], correct_answer=1),
        Question(topic=db_mission, question_text='Which K8s object allows pods to access AWS services via IAM?', options=['ServiceAccount', 'ConfigMap', 'OIDC/IAM Role for ServiceAccounts', 'Secret'], correct_answer=2),
        Question(topic=db_mission, question_text='What command applies DB migrations in Flask?', options=['flask run', 'flask db upgrade', 'flask init', 'python app.py'], correct_answer=1),
        Question(topic=db_mission, question_text='Which SQLAlchemy variable defines the DB string?', options=['DATABASE_URL', 'SQLALCHEMY_DATABASE_URI', 'DB_PATH', 'PG_URL'], correct_answer=1)
    ]

    # 4. Mission: Secret Leakage
    secret_mission = Topic(
        name='Operation: Red Alert',
        description='An AWS access key was leaked in a public GitHub repo. You must rotate the keys and invalidate the old ones before the infrastructure is compromised.',
        slug='secret-leak'
    )

    # 5. Mission: CoreDNS Flapping
    dns_mission = Topic(
        name='Incident: Silent Services',
        description='Internal services can no longer resolve each other. CoreDNS is crashing due to a config error. Restore internal service discovery immediately.',
        slug='dns-failure'
    )

    # 6. Mission: Pipeline Congestion
    jenkins_mission = Topic(
        name='Mission: The CI Jam',
        description='The Jenkins build queue has 50+ pending jobs. A rogue "forever" loop in a test script is hogging all agents. Clear the blockage.',
        slug='jenkins-jam'
    )

    # Questions for Secret Leak
    secret_questions = [
        Question(
            topic=secret_mission,
            question_text='A secret is leaked. After rotating the key, what is the next CRITICAL step?',
            options=[
                'Delete the old key immediately',
                'Rewrite the git history to remove the secret',
                'Change your personal password',
                'Reboot the production nodes'
            ],
            correct_answer=0
        ),
        Question(
            topic=secret_mission,
            question_text='Which tool is best for scanning your repos for secrets BEFORE you commit?',
            options=[
                'git-leaks',
                'SonarQube',
                'Jenkins',
                'Docker Scout'
            ],
            correct_answer=0
        )
    ]

    # Questions for DNS
    dns_questions = [
        Question(
            topic=dns_mission,
            question_text='You suspect DNS issues. Which command tests if a service "db-svc" is resolvable from a pod?',
            options=[
                'nslookup db-svc',
                'ping db-svc',
                'curl db-svc:5432',
                'kubectl get svc'
            ],
            correct_answer=0
        ),
        Question(
            topic=dns_mission,
            question_text='Where is the CoreDNS configuration stored in Kubernetes?',
            options=[
                'In a ConfigMap named "coredns" in kube-system',
                'In the /etc/hosts file of the Master node',
                'In the etcd database directly',
                'In the Docker daemon.json'
            ],
            correct_answer=0
        )
    ]

    # Questions for Jenkins
    jenkins_questions = [
        Question(
            topic=jenkins_mission,
            question_text='A Jenkins job is stuck. How do you find which agent it is running on?',
            options=[
                'Check the "Build Executor Status" on the sidebar',
                'Run "docker ps" on your local machine',
                'Check the "Git" tab',
                'Reinstall Jenkins'
            ],
            correct_answer=0
        ),
        Question(
            topic=jenkins_mission,
            question_text='To prevent a single job from hogging an agent forever, what should you add to the Jenkinsfile?',
            options=[
                'options { timeout(time: 30, unit: "MINUTES") }',
                'parallel { ... }',
                'retry(3)',
                'agent any'
            ],
            correct_answer=0
        )
    ]

    try:
        # Add topics
        db.session.add(crashloop_mission)
        db.session.add(ingress_mission)
        db.session.add(db_mission)
        db.session.add(secret_mission)
        db.session.add(dns_mission)
        db.session.add(jenkins_mission)
        
        # Add questions
        all_qs = crashloop_questions + ingress_questions + db_questions + \
                 secret_questions + dns_questions + jenkins_questions
        for question in all_qs:
            db.session.add(question)
        
        # Commit all changes
        db.session.commit()
        print("Missions uploaded successfully to CyberRange Central!")
        
    except Exception as e:
        db.session.rollback()
        print(f"Error seeding data: {str(e)}")
        raise

if __name__ == '__main__':
    app = create_app()
    with app.app_context():
        seed_data()